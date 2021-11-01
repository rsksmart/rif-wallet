import { Contract, ContractFactory } from 'ethers'

import smartWalletBytecode from './SmartWalletBytecode.json'
import smartWalletABI from '../src/lib/core/SmartWalletABI.json'

import smartWalletFactoryABI from '../src/lib/core/SmartWalletFactoryABI.json'
import smartWalletFactoryBytecode from './SmartWalletFactoryBytecode.json'

import { rpcAccount } from './utils'

export const deploySmartWalletFactory = async (): Promise<Contract> => {
  const smartWalletContractFactory = new ContractFactory(
    smartWalletABI,
    smartWalletBytecode,
    rpcAccount,
  )
  const smartWalletContract = await smartWalletContractFactory.deploy()
  await smartWalletContract.deployTransaction.wait()

  const smartWalletFactoryContractFactory = new ContractFactory(
    smartWalletFactoryABI,
    smartWalletFactoryBytecode,
    rpcAccount,
  )
  const smartWalletFactoryContract =
    await smartWalletFactoryContractFactory.deploy(smartWalletContract.address)
  await smartWalletFactoryContract.deployTransaction.wait()

  return smartWalletFactoryContract
}
