import addresses from 'screens/rnsManager/addresses.json'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { RIFWallet } from 'lib/core'
import { BigNumber } from 'ethers'

import {
  deleteRnsProcessor,
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

  public process = async (domain: string) => {
    try {
      if (!this.index[domain]?.requested) {
        const { makeCommitmentTransaction, secret, hash } =
          await this.rskRegistrar.commitToRegister(
            domain,
            this.wallet.smartWallet.smartWalletAddress,
          )
        this.setIndex(domain, {
          domain,
          secret,
          hash,
          requested: true,
          committed: false,
          registered: false,
        })

        await makeCommitmentTransaction.wait()
        this.setIndex(domain, { ...this.index[domain], committed: true })
        console.log('commited')
      } else if (!this.index[domain]?.committed) {
        console.log('wait for request to finish')
      } else if (!this.index[domain]?.registered) {
        const canReveal = await this.rskRegistrar.canReveal(
          this.index[domain].hash,
        )
        if (await canReveal()) {
          console.log('can register')
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
          await tx.wait()
          this.setIndex(domain, { ...this.index[domain], registered: true })
          console.log('Registered')
        } else {
          console.log('keep waiting')
        }
      } else if (this.index[domain]?.registered) {
        console.log('Domain already Registered')
      }
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}

interface IDomainRegistrationProcess {
  domain: string
  secret: string
  hash: string
  requested: boolean
  committed: boolean
  registered: boolean
}

export interface IDomainRegistrationProcessIndex {
  [domain: string]: IDomainRegistrationProcess
}
