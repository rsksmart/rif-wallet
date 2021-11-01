import { Wallet, ContractTransaction, ContractReceipt, providers, BigNumber } from 'ethers'
import { ReactTestInstance } from 'react-test-renderer'

const nodeUrl = 'http://localhost:8545'

export const testJsonRpcProvider = new providers.JsonRpcProvider(nodeUrl)

export const rpcAccount = testJsonRpcProvider.getSigner(0)

export const sendAndWait = async (txPromise: Promise<ContractTransaction>): Promise<ContractReceipt> => {
  return await (await txPromise).wait()
}

export const fundAccount = (to: string) => rpcAccount.sendTransaction({
  to,
  value: BigNumber.from('1000000000000000000')
})

export const createNewTestWallet = async () => {
  const wallet = Wallet.createRandom().connect(testJsonRpcProvider)
  await sendAndWait(fundAccount(wallet.address))
  return wallet
}

export const getTextFromTextNode = (textNode: ReactTestInstance) => textNode.children[0]
