import { providers, BigNumber } from 'ethers'
import { tenPow } from '../../lib/token/BaseToken'
import { ERC20Token } from '../../lib/token/ERC20Token'
import { ERC677__factory } from '../../lib/token/types'
import { getAllTokens, makeRBTCToken } from '../../lib/token/tokenMetadata'
import { Signer } from '@ethersproject/abstract-signer'

import AbiEnhancer from './AbiEnhancer'
import { RBTCToken } from '../token/RBTCToken'

const Config = {
  BLOCKCHAIN_HTTP_URL: 'HTTP://127.0.0.1:8545',
}

const TEST_TOKEN_DECIMALS = 18

const getJsonRpcProvider = async (): Promise<providers.JsonRpcProvider> => {
  return new providers.JsonRpcProvider(Config.BLOCKCHAIN_HTTP_URL)
}

const getSigner = async (index: number = 0) => {
  const provider = await getJsonRpcProvider()
  return provider.getSigner(index)
}

jest.mock('../../lib/token/tokenMetadata', () => ({
  getAllTokens: jest.fn(),
  makeRBTCToken: jest.fn(),
  MAINNET_CHAINID: 30,
}))

describe('Abi Enhancer', () => {
  const initialBalance = BigNumber.from(200)
  let transactionRequest = {
    from: '0x2750de12a98AD6BA53bE8d0DbE4a595d63Fdf985',
    to: '0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934',
    value: BigNumber.from(1000000000000000), // 0.001 in decimals
    data: '0xa9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c93400000000000000000000000000000000000000000000000000038d7ea4c68000',
  }
  let tokenAddress1 = ''
  let tokenAddress2 = ''
  let accountSigner: Signer | null = null

  beforeEach(async () => {
    accountSigner = await getSigner()
    const rbtcSigner = await getSigner(7)
    const accountAddress = await accountSigner.getAddress()

    // using ERC677__factory that supports ERC20 to set totalSupply (just for testing purpose)
    const initialSupply = initialBalance.mul(tenPow(TEST_TOKEN_DECIMALS))
    const erc677Factory = new ERC677__factory(accountSigner)
    const firstErc20 = (await erc677Factory.deploy(
      accountAddress,
      initialSupply,
      'FIRST_TEST_ERC20',
      'FIRST_TEST_ERC20',
    )) as any

    const secondErc20 = (await erc677Factory.deploy(
      accountAddress,
      initialSupply,
      'SECOND_TEST_ERC20',
      'SECOND_TEST_ERC20',
    )) as any

    tokenAddress1 = firstErc20.address
    tokenAddress2 = secondErc20.address

    const firstErc20Token = new ERC20Token(
      tokenAddress1,
      accountSigner,
      'FIRST_TEST_ERC20',
      'logo.jpg',
    )

    const secondErc20Token = new ERC20Token(
      tokenAddress2,
      accountSigner,
      'SECOND_TEST_ERC20',
      'logo.jpg',
    )
    const getAllTokensMock = async () => [firstErc20Token, secondErc20Token]
    const makeRBTCTokenMock = () => {
      return new RBTCToken(rbtcSigner, 'TRBTC', 'logo.jpg', 31)
    }
    // @ts-ignore
    getAllTokens.mockImplementation(getAllTokensMock)
    // @ts-ignore
    makeRBTCToken.mockImplementation(makeRBTCTokenMock)

    transactionRequest = { ...transactionRequest, to: tokenAddress1 }
  })

  it('should return erc20 token info enhanced', async () => {
    const enhancer = new AbiEnhancer()

    const result = await enhancer.enhance(accountSigner!, transactionRequest)

    expect(result).not.toBeNull()
    expect(result!.from).toBe(transactionRequest.from)
    expect(result!.to).toBe('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934')
    expect(result!.balance).toBe(initialBalance.toString())
    expect(result!.value).toBe('0.001')
  })

  it('should return RBTC info enhanced if data is undefined', async () => {
    const enhancer = new AbiEnhancer()

    const result = await enhancer.enhance(accountSigner!, {
      ...transactionRequest,
      data: undefined,
    })

    expect(result).not.toBeNull()
    expect(result!.from).toBe(transactionRequest.from)
    expect(result!.to).toBe(transactionRequest.to)
    expect(result!.balance).toBe('100')
    expect(result!.value).toBe('0.001')
  })

  it('should return RBTC info enhanced if the token is not in the tokens metadata', async () => {
    const enhancer = new AbiEnhancer()

    const result = await enhancer.enhance(accountSigner!, {
      ...transactionRequest,
      to: '0xNotExist',
    })

    expect(result).not.toBeNull()
    expect(result!.from).toBe(transactionRequest.from)
    expect(result!.to).toBe('0xNotExist')
    expect(result!.balance).toBe('100')
    expect(result!.value).toBe('0.001')
  })
})
