import { Signer, constants } from 'ethers'

type TMethods = {
  [key: string]: any
}

export class WalletConnectAdapter {
  private signer: Signer

  constructor(signer: Signer) {
    this.signer = signer
  }

  async handleCall(method: string, params: any[]) {
    const methodsMapper: TMethods = {
      eth_sendTransaction: this.signer.sendTransaction.bind(this.signer),
    }

    const methodToExecute = methodsMapper[method as any]

    if (methodToExecute) {
      const payload = params.reduce((prev, curr) => ({ ...prev, ...curr }), {})

      if (payload.data === '') {
        // TODO: assign undefined once the RIFWallet changes are applied
        payload.data = constants.HashZero
      }

      console.log('executing', payload)
      return methodToExecute(payload)
    }
  }
}
