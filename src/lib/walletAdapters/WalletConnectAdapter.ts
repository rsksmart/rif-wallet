import { Signer, constants } from 'ethers'
export class WalletConnectAdapter {
  private resolvers: IResolver[]

  constructor(signer: Signer) {
    this.resolvers = [
      new SendTransactionResolver(signer),
      new PersonalSignResolver(signer),
    ]
  }

  async handleCall(method: string, params: any[]) {
    const resolver = this.resolvers.find(x => x.methodName === method)

    if (resolver) {
      return resolver.resolve(params)
    }
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

    if (payload.data === '') {
      // TODO: assign undefined once the RIFWallet changes are applied
      payload.data = constants.HashZero
    }

    const tx = await this.signer.sendTransaction(payload)

    return tx.hash
  }
}

class PersonalSignResolver implements IResolver {
  private signer: Signer
  public methodName = 'personal_sign'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const message = params[0]

    console.log('PersonalSignResolver', message)

    return this.signer.signMessage(message)
  }
}
