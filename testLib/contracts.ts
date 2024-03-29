import { Contract, ContractFactory } from 'ethers'
import smartWalletABI from '@rsksmart/rif-relay-light-sdk/dist/SmartWallet/SmartWalletABI.json'
import smartWalletFactoryABI from '@rsksmart/rif-relay-light-sdk/dist/SmartWalletFactory/SmartWalletFactoryABI.json'

import smartWalletBytecode from './SmartWalletBytecode.json'
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
