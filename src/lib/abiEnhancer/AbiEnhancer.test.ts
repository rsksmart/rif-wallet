import { BigNumber } from 'ethers'
import { Signer } from '@ethersproject/abstract-signer'

import { AbiEnhancer } from './AbiEnhancer'
import { deployTestTokens, getSigner } from '../../../testLib/utils'
import * as tokenMetadata from 'rif-wallet/packages/token'

describe('Abi Enhancer', () => {
  let transactionRequest = {
    from: '0x2750de12a98AD6BA53bE8d0DbE4a595d63Fdf985',
    to: '0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934',
    value: BigNumber.from(1000000000000000), // 0.001 in decimals
    data: '0xa9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c93400000000000000000000000000000000000000000000000000038d7ea4c68000',
  }
  let accountSigner: Signer | null = null

  beforeEach(async () => {
    accountSigner = getSigner()

    const { firstErc20Token, secondErc20Token, rbtcToken } =
      await deployTestTokens(accountSigner)

    ;(tokenMetadata.getAllTokens as any) = jest.fn(() =>
      Promise.resolve([firstErc20Token, secondErc20Token]),
    )
    ;(tokenMetadata.makeRBTCToken as any) = jest.fn(() => rbtcToken)

    transactionRequest = { ...transactionRequest, to: firstErc20Token.address }
  })

  it('should return erc20 token info enhanced', async () => {
    const enhancer = new AbiEnhancer()

    const result = await enhancer.enhance(accountSigner!, transactionRequest)

    expect(result).not.toBeNull()
    expect(result!.from).toBe(transactionRequest.from)
    expect(result!.to).toBe('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934')
    expect(result!.balance).toBe(BigNumber.from(200).toString())
    expect(result!.value).toBe('0.001')
  })

  it('should return RBTC info enhanced if data is undefined', async () => {
    const account = await getSigner(7)

    const enhancer = new AbiEnhancer()

    const result = await enhancer.enhance(account!, {
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
    const account = getSigner(7)

    const enhancer = new AbiEnhancer()

    const result = await enhancer.enhance(account!, {
      ...transactionRequest,
      data: undefined,
      to: '0xNotExist',
    })

    expect(result).not.toBeNull()
    expect(result!.from).toBe(transactionRequest.from)
    expect(result!.to).toBe('0xNotExist')
    expect(result!.balance).toBe('100')
    expect(result!.value).toBe('0.001')
  })
})
