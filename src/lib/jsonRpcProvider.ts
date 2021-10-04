import { providers } from 'ethers'
const rpcUrl = 'https://public-node.testnet.rsk.co'

export const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl)
