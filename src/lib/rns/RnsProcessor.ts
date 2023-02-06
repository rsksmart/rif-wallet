import addresses from 'screens/rnsManager/addresses.json'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { RIFWallet } from 'lib/core'
import { BigNumber } from 'ethers'

import {
  getRnsProcessor,
  hasRnsProcessor,
  saveRnsProcessor,
} from 'storage/RnsProcessorStore'

export class RnsProcessor {
  private rskRegistrar
  private wallet
  private index: IDomainRegistrationProcessIndex = {}

  constructor({ wallet }: { wallet: RIFWallet }) {
    this.wallet = wallet
    this.rskRegistrar = new RSKRegistrar(
      addresses.rskOwnerAddress,
      addresses.fifsAddrRegistrarAddress,
      addresses.rifTokenAddress,
      wallet,
    )
    if (hasRnsProcessor()) {
      this.index = getRnsProcessor()
    }
  }
  private setIndex = (
    domain: string,
    domainRegistrationProcess: IDomainRegistrationProcess,
  ) => {
    this.index[domain] = domainRegistrationProcess
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
        })

        makeCommitmentTransaction.wait().then(() => {
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
      throw new Error((err as Error).message)
    }
    return null
  }

  public canReveal = async (domain: string) => {
    try {
      if (this.index[domain]?.commitmentConfirmed) {
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
      const canReveal = await this.rskRegistrar.canReveal(
        this.index[domain].hash,
      )
      if (await canReveal()) {
        const duration = 1
        const price = await this.rskRegistrar.price(
          domain,
          BigNumber.from(duration),
        )

        const durationToRegister = BigNumber.from(duration)
        const priceToRegister = BigNumber.from(price)

        const tx = await this.rskRegistrar.register(
          domain,
          this.wallet.smartWallet.smartWalletAddress,
          this.index[domain].secret,
          durationToRegister,
          priceToRegister,
        )
        this.setIndex(domain, {
          ...this.index[domain],
          registeringRequested: true,
          registrationHash: tx.hash,
        })

        tx.wait().then(() => {
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
      throw new Error((err as Error).message)
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
