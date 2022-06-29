import { Contract, ContractFactory } from 'ethers'

import smartWalletBytecode from './SmartWalletBytecode.json'
import smartWalletFactoryBytecode from './SmartWalletFactoryBytecode.json'
import { SmartWalletABIJSON, SmartWalletFactoryABIJSON } from 'rif-wallet/packages/core'

import { rpcAccount } from './utils'

export const deploySmartWalletFactory = async (): Promise<Contract> => {
  const smartWalletContractFactory = new ContractFactory(
    SmartWalletABIJSON,
    smartWalletBytecode,
    rpcAccount,
  )
  const smartWalletContract = await smartWalletContractFactory.deploy()
  await smartWalletContract.deployTransaction.wait()

  const smartWalletFactoryContractFactory = new ContractFactory(
    SmartWalletFactoryABIJSON,
    smartWalletFactoryBytecode,
    rpcAccount,
  )
  const smartWalletFactoryContract =
    await smartWalletFactoryContractFactory.deploy(smartWalletContract.address)
  await smartWalletFactoryContract.deployTransaction.wait()

  return smartWalletFactoryContract
}
