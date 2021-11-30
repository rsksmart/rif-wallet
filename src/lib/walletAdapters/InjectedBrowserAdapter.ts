import { Signer } from 'ethers'
import { RIFWallet } from '../core'
import { AccountsResolver } from './resolvers/AccountsResolver'
import { CallsResolver } from './resolvers/CallsResolver'
import { ChainIdResolver } from './resolvers/ChainIdResolver'
import { EstimateGasResolver } from './resolvers/EstimateGasResolver'
import { GetBalanceResolver } from './resolvers/GetBalanceResolver'
import { GetBlockByNumberResolver } from './resolvers/GetBlockByNumberResolver'
import { BlockNumberResolver } from './resolvers/BlockNumberResolver'
import { NetVersionResolver } from './resolvers/NetVersionResolver'
import { PersonalSignResolver } from './resolvers/PersonalSignResolver'
import { RequestAccountsResolver } from './resolvers/RequestAccountsResolver'
import { SendTransactionResolver } from './resolvers/SendTransactionResolver'
import { SignTypedDataResolver } from './resolvers/SignTypedDataResolver'
import { SignTypedDataV4Resolver } from './resolvers/SignTypedDataV4Resolver'
import { GasPriceResolver } from './resolvers/GasPriceResolver'
import { RPCAdapter } from './RPCAdapter'

export class InjectedBrowserAdapter extends RPCAdapter {
  constructor(signer: Signer) {
    super([
      new SendTransactionResolver(signer),
      new PersonalSignResolver(signer),
      new SignTypedDataResolver(signer as RIFWallet),
      new SignTypedDataV4Resolver(signer as RIFWallet),
      new AccountsResolver(signer as RIFWallet),
      new RequestAccountsResolver(signer as RIFWallet),
      new ChainIdResolver(signer),
      new NetVersionResolver(signer),
      new CallsResolver(signer),
      new EstimateGasResolver(signer),
      new GetBalanceResolver(signer),
      new BlockNumberResolver(signer),
      new GetBlockByNumberResolver(signer),
      new GasPriceResolver(signer)
    ])
  }
}
