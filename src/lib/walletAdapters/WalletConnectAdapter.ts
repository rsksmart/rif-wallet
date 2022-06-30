import { Signer } from 'ethers'
import { RIFWallet } from 'rif-wallet/packages/core'
import { PersonalSignResolver } from './resolvers/PersonalSignResolver'
import { SendTransactionResolver } from './resolvers/SendTransactionResolver'
import { SignTypedDataResolver } from './resolvers/SignTypedDataResolver'
import { RPCAdapter } from './RPCAdapter'

export class WalletConnectAdapter extends RPCAdapter {
  constructor(signer: Signer) {
    super([
      new SendTransactionResolver(signer),
      new PersonalSignResolver(signer),
      new SignTypedDataResolver(signer as RIFWallet),
    ])
  }
}
