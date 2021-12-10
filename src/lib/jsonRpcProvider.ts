import { providers } from 'ethers'
export const rpcUrl = 'https://public-node.testnet.rsk.co'

export const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl)
