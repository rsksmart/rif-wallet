import { ChainTypesByIdType } from 'shared/constants/chainConstants'

import { TESTNET, MAINNET } from './addresses.json'

export interface RNS_ADDRESSES_TYPE {
  rskOwnerAddress: string
  fifsAddrRegistrarAddress: string
  rifTokenAddress: string
  rnsRegistryAddress: string
}

export const RNS_ADDRESSES_BY_CHAIN_ID: Record<
  ChainTypesByIdType,
  RNS_ADDRESSES_TYPE
> = {
  30: MAINNET,
  31: TESTNET,
}
