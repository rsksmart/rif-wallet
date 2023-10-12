import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { BigNumber } from 'ethers'

import {
  getRnsProcessor,
  hasRnsProcessor,
  saveRnsProcessor,
} from 'storage/RnsProcessorStore'
import { OnSetTransactionStatusChange } from 'screens/send/types'
import { RNS_ADDRESSES_TYPE } from 'screens/rnsManager/types'

export class RnsProcessor {
  private rskRegistrar
  private wallet
  private index: IDomainRegistrationProcessIndex = {}
  private rnsAddresses: RNS_ADDRESSES_TYPE
  onSetTransactionStatusChange?: OnSetTransactionStatusChange

  constructor({
    wallet,
    onSetTransactionStatusChange,
    rnsAddresses,
  }: {
    wallet: RIFWallet
    onSetTransactionStatusChange?: OnSetTransactionStatusChange
    rnsAddresses: RNS_ADDRESSES_TYPE
  }) {
    this.wallet = wallet
    this.rnsAddresses = rnsAddresses
    this.rskRegistrar = new RSKRegistrar(
      this.rnsAddresses.rskOwnerAddress,
      this.rnsAddresses.fifsAddrRegistrarAddress,
      this.rnsAddresses.rifTokenAddress,
      wallet,
    )
    if (hasRnsProcessor()) {
      this.index = getRnsProcessor()
    }
    this.onSetTransactionStatusChange = onSetTransactionStatusChange
  }
  private setIndex = (
    domain: string,
    domainRegistrationProcess: IDomainRegistrationProcess,
  ) => {
    this.index[domain] = domainRegistrationProcess
    saveRnsProcessor(this.index)
  }

  public deleteRnsProcess = (domain: string) => {
    delete this.index[domain]
    saveRnsProcessor(this.index)
  }

  public process = async (domain: string, duration: number) => {
    try {
      if (!this.index[domain]?.commitmentRequested) {
        const { makeCommitmentTransaction, secret, hash } =
          await this.rskRegistrar.commitToRegister(
            domain,
            this.wallet.smartWallet.smartWalletAddress,
          )

        this.onSetTransactionStatusChange?.({
          ...makeCommitmentTransaction,
          txStatus: 'PENDING',
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
            txStatus: 'CONFIRMED',
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

  public canReveal = async (
    domain: string,
    isWaitingForCommitmentTransaction = true,
  ) => {
    try {
      // Fail-safe to only ping rskRegistrar after 3 minutes have passed since the transaction was created
      // This to avoid request load
      if (
        this.index[domain]?.commitmentConfirmed ||
        (!isWaitingForCommitmentTransaction &&
          this.isDomainAllowedToPingRskRegistrarCanReveal(domain))
      ) {
        const canReveal = await this.rskRegistrar.canReveal(
          this.index[domain].hash,
        )
        if (await canReveal()) {
          return DomainRegistrationEnum.COMMITMENT_READY
        } else {
          return DomainRegistrationEnum.WAITING_COMMITMENT
        }
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
          this.wallet.smartWallet.smartWalletAddress,
          this.index[domain].secret,
          durationToRegister,
          price,
        )
        this.onSetTransactionStatusChange?.({
          ...tx,
          txStatus: 'PENDING',
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
            txStatus: 'CONFIRMED',
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
  public getStatus = (domain: string): IDomainRegistrationProcess => {
    return this.index[domain]
  }
}

interface IDomainRegistrationProcess {
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
  [domain: string]: IDomainRegistrationProcess
}
