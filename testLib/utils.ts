import {
  Wallet,
  ContractTransaction,
  ContractReceipt,
  providers,
  BigNumber,
  Signer,
} from 'ethers'
import { ReactTestInstance } from 'react-test-renderer'
import { tenPow } from '../src/lib/token/BaseToken'
import { ERC20Token } from '../src/lib/token/ERC20Token'
import { RBTCToken } from '../src/lib/token/RBTCToken'
import { ERC677__factory } from '../src/lib/token/types'

const nodeUrl = 'http://localhost:8545'

export const testJsonRpcProvider = new providers.JsonRpcProvider(nodeUrl)

export const rpcAccount = testJsonRpcProvider.getSigner(0)

export const sendAndWait = async (
  txPromise: Promise<ContractTransaction>,
): Promise<ContractReceipt> => {
  return await (await txPromise).wait()
}

export const fundAccount = (to: string) =>
  rpcAccount.sendTransaction({
    to,
    value: BigNumber.from('1000000000000000000'),
  })

export const createNewTestWallet = async (privateKey?: string) => {
  const wallet = (
    !privateKey ? Wallet.createRandom() : new Wallet(privateKey)
  ).connect(testJsonRpcProvider)
  await sendAndWait(fundAccount(wallet.address))
  return wallet
}

export const getTextFromTextNode = (textNode: ReactTestInstance) =>
  textNode.children[0]
// https://stackoverflow.com/questions/48011353/how-to-unwrap-type-of-a-promise
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T

export const TEST_TOKEN_DECIMALS = 18
export const TEST_CHAIN_ID = 31

export const getSigner = (index: number = 0) => {
  return testJsonRpcProvider.getSigner(index)
}

export const deployTestTokens = async (
  accountSigner: Signer,
  initialBalance: BigNumber = BigNumber.from(200),
) => {
  const rbtcSigner = getSigner(7)
  const deploySignerAddress = await accountSigner.getAddress()

  // using ERC677__factory that supports ERC20 to set totalSupply (just for testing purpose)
  const initialSupply = initialBalance.mul(tenPow(TEST_TOKEN_DECIMALS))
  const erc677Factory = new ERC677__factory(accountSigner)
  const firstErc20 = (await erc677Factory.deploy(
    deploySignerAddress,
    initialSupply,
    'FIRST_TEST_ERC20',
    'FIRST_TEST_ERC20',
  )) as any

  const secondErc20 = (await erc677Factory.deploy(
    deploySignerAddress,
    initialSupply,
    'SECOND_TEST_ERC20',
    'SECOND_TEST_ERC20',
  )) as any

  const firstErc20Token = new ERC20Token(
    firstErc20.address,
    accountSigner,
    'FIRST_TEST_ERC20',
    'logo.jpg',
  )

  const secondErc20Token = new ERC20Token(
    secondErc20.address,
    accountSigner,
    'SECOND_TEST_ERC20',
    'logo.jpg',
  )

  const rbtcToken = new RBTCToken(rbtcSigner, 'TRBTC', 'logo.jpg', 31)

  return {
    firstErc20Token,
    secondErc20Token,
    rbtcToken,
  }
}
