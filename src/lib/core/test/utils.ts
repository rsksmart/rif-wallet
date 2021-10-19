import { Wallet, Contract, ContractFactory, ContractTransaction, ContractReceipt, providers, BigNumber } from 'ethers'

import smartWalletBytecode from './SmartWalletBytecode.json'
import smartWalletABI from '../src/SmartWalletABI.json'

import smartWalletFactoryBytecode from './SmartWalletFactoryBytecode.json'
import smartWalletFactoryABI from '../src/SmartWalletFactoryABI.json'

const nodeUrl = 'http://localhost:8545'

export const testJsonRpcProvider = new providers.JsonRpcProvider(nodeUrl)

const rpcAccount = testJsonRpcProvider.getSigner(0)

export const sendAndWait = async (tx: Promise<ContractTransaction>): Promise<ContractReceipt> => {
  return await (await tx).wait()
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

export const deploySmartWalletFactory = async (): Promise<Contract> => {
  const smartWalletContractFactory = new ContractFactory(smartWalletABI, smartWalletBytecode, rpcAccount)
  const smartWalletContract = await smartWalletContractFactory.deploy()
  await smartWalletContract.deployTransaction.wait()

  const smartWalletFactoryContractFactory = new ContractFactory(smartWalletFactoryABI, smartWalletFactoryBytecode, rpcAccount)
  const smartWalletFactoryContract = await smartWalletFactoryContractFactory.deploy(smartWalletContract.address)
  await smartWalletFactoryContract.deployTransaction.wait()

  return smartWalletFactoryContract
}
