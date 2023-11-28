/* eslint-disable @typescript-eslint/no-var-requires */
const { ethers, Contract, BigNumber } = require('../../node_modules/ethers')
const SmartWalletFactoryABI = require('./abi/smartWalletFactory.json')
const smartWalletABI = require('./abi/smartWalletABI.json')
const erc20Abi = require('./abi/erc20Abi.json')

async function main() {
  // The mnemonic of the EOA wallet. i.e. the one the user saw and confirmed when they loaded up the app:
  const mnemonic = ''

  // RPC Provider
  // TESTNET: https://public-node.testnet.rsk.co
  // MAIINET: https://public-node.rsk.co
  const provider = new ethers.providers.JsonRpcProvider(
    'https://public-node.testnet.rsk.co',
  )

  // Set the derivation path for the network.
  // const path = "m/44'/137'/0'/0/0" // mainnet
  const path = "m/44'/37310'/0'/0/0" // testnet

  const wallet = ethers.Wallet.fromMnemonic(mnemonic, path)
  wallet.provider = provider

  console.log('EOA ADDRESS:', wallet.address)

  // Use the SmartWalletFactory contract to get the smartwallet of the address. Verify the factory addresses here https://github.com/rsksmart/rif-wallet/blob/develop/config.json
  // TESTNET: 0xbadb31caf5b95edd785446b76219b60fb1f07233
  // MAINNET: 0x9eebec6c5157bee13b451b1dfe1ee2cb40846323
  const smartWalletFactory = new Contract(
    '0xbadb31caf5b95edd785446b76219b60fb1f07233',
    SmartWalletFactoryABI,
    provider,
  )

  const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress(
    wallet.address.toLowerCase(),
    '0x0000000000000000000000000000000000000000',
    0,
  )

  console.log('SMART WALLET ADDRESS:', smartWalletAddress)

  // The user's smartwallet contract:
  const smartWallet = new Contract(
    smartWalletAddress.toLowerCase(),
    smartWalletABI,
    wallet.connect(provider),
  )

  // Create a transaction to execute:
  // RIF is an ERC-677 contract but we are only using the transfer method so we can use the ERC20 ABI. However, the following could be any transaction you want to execute.
  const rifAddress = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'
  const rifContract = new Contract(rifAddress, erc20Abi, provider)

  // (optional) Check the balance first
  const balance = await rifContract.balanceOf(smartWalletAddress)
  console.log('RIF BALANCE:', balance.toString())

  // Get hex data for the function transfer. In the example below we are
  // transferring 2RIF to the address 0x3dd03d...
  const transferData = rifContract.interface.encodeFunctionData('transfer', [
    '0x3dd03d7d6c3137f1eb7582ba5957b8a2e26f304a',
    BigNumber.from('2000000000000000000'),
  ])

  // Execute the transaction
  // The EOA account must have rBTC to pay the gas for this transaction:
  const tx = await smartWallet.directExecute(
    rifAddress,
    transferData,
    {}, // other transaction properties: gas, gasLimit, etc...
  )

  console.log('TRANSACTION HASH:', tx.hash)
}

main()
