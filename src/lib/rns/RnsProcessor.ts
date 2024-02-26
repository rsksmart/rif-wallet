import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { BigNumber, utils } from 'ethers'

import {
  getRnsProcessIndex,
  hasRnsProcessIndex,
  saveRnsProcessIndex,
} from 'storage/RnsProcessorStore'
import { RNS_ADDRESSES_TYPE } from 'screens/rnsManager/types'
import {
  OnSetTransactionStatusChange,
  TransactionStatus,
} from 'store/shared/types'
import { Wallet } from 'shared/wallet'

import { RelayWallet } from '../relayWallet'

interface DomainRegistrationProcess {
  domain: string
  secret: string
  hash: string
  registrationHash: string
  duration: number
  commitmentRequested: boolean
  commitmentConfirmed: boolean
  registeringRequested: boolean
  registeringConfirmed: boolean
  commitmentRequestedTimestamp: number
}
export enum DomainRegistrationEnum {
  COMMITMENT_REQUESTED = 'COMMITMENT_REQUESTED',
  COMMITMENT_CONFIRMED = 'COMMITMENT_CONFIRMED',
  WAITING_COMMITMENT = 'WAITING_COMMITMENT',
  COMMITMENT_READY = 'COMMITMENT_READY',
  REGISTERING_REQUESTED = 'REGISTERING_REQUESTED',
  REGISTERING_CONFIRMED = 'REGISTERING_CONFIRMED',
}

export interface IDomainRegistrationProcessIndex {
  [domain: string]: DomainRegistrationProcess
}

export const calculateRnsDomainPrice = async (
  rskRegistrar: RSKRegistrar,
  label: string,
  years: number,
) => {
  return utils.formatUnits(
    await rskRegistrar.price(label, BigNumber.from(years)),
  )
}

export class RnsProcessor {
  private address: string
  private index: IDomainRegistrationProcessIndex = {}
  private rnsAddresses: RNS_ADDRESSES_TYPE
  public rskRegistrar
  onSetTransactionStatusChange?: OnSetTransactionStatusChange

  constructor(
    wallet: Wallet,
    onSetTransactionStatusChange: OnSetTransactionStatusChange,
    rnsAddresses: RNS_ADDRESSES_TYPE,
  ) {
    this.address =
      wallet instanceof RelayWallet ? wallet.smartWalletAddress : wallet.address
    this.rnsAddresses = rnsAddresses
    this.rskRegistrar = new RSKRegistrar(
      this.rnsAddresses.rskOwnerAddress,
      this.rnsAddresses.fifsAddrRegistrarAddress,
      this.rnsAddresses.rifTokenAddress,
      wallet,
    )

    if (hasRnsProcessIndex()) {
      this.index = getRnsProcessIndex()
    }

    this.onSetTransactionStatusChange = onSetTransactionStatusChange
  }
  private setIndex = (
    domain: string,
    domainRegistrationProcess: DomainRegistrationProcess,
  ) => {
    this.index[domain] = domainRegistrationProcess
    saveRnsProcessIndex(this.index)
  }

  public deleteRnsProcess = (domain: string) => {
    delete this.index[domain]
    saveRnsProcessIndex(this.index)
  }

  public process = async (domain: string, duration: number) => {
    try {
      if (!this.index[domain]?.commitmentRequested) {
        const { makeCommitmentTransaction, secret, hash } =
          await this.rskRegistrar.commitToRegister(domain, this.address)

        this.onSetTransactionStatusChange?.({
          ...makeCommitmentTransaction,
          txStatus: TransactionStatus.PENDING,
          value: BigNumber.from('0'),
          finalAddress: this.rnsAddresses.fifsAddrRegistrarAddress,
        })
        this.setIndex(domain, {
          domain,
          secret,
          hash,
          registrationHash: '',
          duration,
          commitmentRequested: true,
          commitmentConfirmed: false,
          registeringRequested: false,
          registeringConfirmed: false,
          commitmentRequestedTimestamp: Date.now(),
        })

        makeCommitmentTransaction.wait().then(commitmentTransaction => {
          this.onSetTransactionStatusChange?.({
            ...commitmentTransaction,
            txStatus: TransactionStatus.USER_CONFIRM,
          })
          this.setIndex(domain, {
            ...this.index[domain],
            commitmentConfirmed: true,
          })
          return DomainRegistrationEnum.COMMITMENT_CONFIRMED
        })
        return DomainRegistrationEnum.COMMITMENT_REQUESTED
      } else if (this.index[domain]?.commitmentConfirmed) {
        return DomainRegistrationEnum.COMMITMENT_CONFIRMED
      } else if (!this.index[domain]?.commitmentConfirmed) {
        return DomainRegistrationEnum.COMMITMENT_REQUESTED
      }
    } catch (err) {
      if (err instanceof Error || typeof err === 'string') {
        throw new Error(err.toString())
      }
    }
    return null
  }
  /**
   * Should only allow to ping rsk after 3 minutes have passed
   * @param domain
   */
  isDomainAllowedToPingRskRegistrarCanReveal = (domain: string) => {
    const timeWithThreeMinutesAdded = new Date(
      this.index[domain].commitmentRequestedTimestamp,
    )
    timeWithThreeMinutesAdded.setMinutes(
      timeWithThreeMinutesAdded.getMinutes() + 3,
    )

    return new Date() > timeWithThreeMinutesAdded
  }

  public canReveal = async (domain: string) => {
    try {
      const canReveal = await this.rskRegistrar.canReveal(
        this.index[domain].hash,
      )

      if (await canReveal()) {
        return DomainRegistrationEnum.COMMITMENT_READY
      } else {
        return DomainRegistrationEnum.WAITING_COMMITMENT
      }
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  public price = async (domain: string) => {
    if (this.index[domain]) {
      const alias = this.index[domain]?.domain
      const duration = this.index[domain]?.duration
      return this.rskRegistrar
        .price(alias, BigNumber.from(duration))
        .then(price => {
          const rifPrice: BigNumber = price
          return rifPrice
        })
    } else {
      return BigNumber.from(0)
    }
  }
  public register = async (domain: string) => {
    try {
      const { hash, duration } = this.index[domain]
      const canReveal = await this.rskRegistrar.canReveal(hash)

      if (await canReveal()) {
        const price = await this.rskRegistrar.price(
          domain,
          BigNumber.from(duration),
        )
        const durationToRegister = BigNumber.from(duration)

        const tx = await this.rskRegistrar.register(
          domain,
          this.address,
          this.index[domain].secret,
          durationToRegister,
          price,
        )
        this.onSetTransactionStatusChange?.({
          ...tx,
          txStatus: TransactionStatus.PENDING,
          finalAddress: this.rnsAddresses.fifsAddrRegistrarAddress,
        })
        this.setIndex(domain, {
          ...this.index[domain],
          registeringRequested: true,
          registrationHash: tx.hash,
        })

        tx.wait().then(txReceipt => {
          this.onSetTransactionStatusChange?.({
            ...txReceipt,
            txStatus: TransactionStatus.USER_CONFIRM,
          })
          this.setIndex(domain, {
            ...this.index[domain],
            registeringConfirmed: true,
          })
          return DomainRegistrationEnum.REGISTERING_CONFIRMED
        })
        return DomainRegistrationEnum.REGISTERING_REQUESTED
      } else {
        return DomainRegistrationEnum.WAITING_COMMITMENT
      }
    } catch (err) {
      if (err instanceof Error || typeof err === 'string') {
        throw new Error(err.toString())
      }
      if (err && 'message' in err) {
        throw new Error((err as { message: string }).message)
      }
    }
  }
  public getStatus = (domain: string): DomainRegistrationProcess => {
    return this.index[domain]
  }
}
