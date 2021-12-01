import { TransactionResponse } from '@ethersproject/providers'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer, constants, utils, BigNumber } from 'ethers'
import { RIFWallet } from '../core'
export class WalletConnectAdapter {
  private resolvers: IResolver[]

  constructor(signer: Signer) {
    this.resolvers = [
      new SendTransactionResolver(signer),
      new PersonalSignResolver(signer),
      new SignTypedDataResolver(signer as RIFWallet),
    ]
  }

  async handleCall(method: string, params: any[]) {
    const resolver = this.resolvers.find(x => x.methodName === method)

    if (!resolver) {
      throw new Error(
        `'${method}' method not supported by WalletConnectAdapter.`,
      )
    }

    return resolver.resolve(params)
  }
}

interface IResolver {
  methodName: string
  resolve: (params: any[]) => Promise<any>
}

class SendTransactionResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_sendTransaction'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const payload = params.reduce((prev, curr) => ({ ...prev, ...curr }), {})

    const formattedPayload: TransactionRequest = {
      to: payload.to,
      from: payload.from,
      nonce: payload.nonce,
      data: payload.data || constants.HashZero,
      value: BigNumber.from(payload.value || 0),
      chainId: payload.chainId,
      gasLimit: BigNumber.from(payload.gas || 0), // WC's gas to gasLimit
      gasPrice: BigNumber.from(payload.gasPrice || 0),
    }

    return this.signer
      .sendTransaction(formattedPayload)
      .then((tx: TransactionResponse) => tx.hash)
  }
}

class PersonalSignResolver implements IResolver {
  private signer: Signer
  public methodName = 'personal_sign'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const message = utils.toUtf8String(params[0])

    return this.signer.signMessage(message)
  }
}

class SignTypedDataResolver implements IResolver {
  private signer: RIFWallet
  public methodName = 'eth_signTypedData'

  constructor(signer: RIFWallet) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const { domain, message, types } = JSON.parse(params[1])

    // delete domain type
    if (types.EIP712Domain) {
      delete types.EIP712Domain
    }

    return this.signer._signTypedData(domain, types, message)
  }
}
