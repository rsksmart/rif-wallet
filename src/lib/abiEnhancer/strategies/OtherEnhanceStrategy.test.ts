import { IToken } from '../../token/BaseToken'
import { Signer } from '@ethersproject/abstract-signer'

import { OtherEnhanceStrategy } from './OtherEnhanceStrategy'
import { deployTestTokens, getSigner } from '../../../../testLib/utils'
import * as tokenMetadata from '../../token/tokenMetadata'

describe('Other Enhance Strategy', () => {
  let transactionRequest = {
    from: '0x2750de12a98AD6BA53bE8d0DbE4a595d63Fdf985',
    to: '0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934',
    data: '0xa9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c93400000000000000000000000000000000000000000000000000038d7ea4c68000',
  }
  let accountSigner: Signer | null = null
  let testToken: IToken | null = null

  beforeEach(async () => {
    accountSigner = getSigner()

    const { firstErc20Token, secondErc20Token, rbtcToken } =
      await deployTestTokens(accountSigner)

    tokenMetadata.getAllTokens = jest.fn(() =>
      Promise.resolve([firstErc20Token, secondErc20Token]),
    )
    tokenMetadata.makeRBTCToken = jest.fn(() => rbtcToken)

    transactionRequest = { ...transactionRequest, to: firstErc20Token.address }
    testToken = firstErc20Token
  })

  it('should return transaction info enhanced', async () => {
    const strategy = new OtherEnhanceStrategy()

    if (accountSigner) {
      const result = await strategy.parse(accountSigner, transactionRequest)

      expect(result).not.toBeNull()
      expect(result?.functionName).toBe('transfer')
      expect(result?.from).toBe(transactionRequest.from)
      expect(result?.to).toBe(testToken?.address)
      expect(result?.functionParameters?.length).toBeGreaterThan(0)
    }
  })

  it('should return null if data is empty', async () => {
    const strategy = new OtherEnhanceStrategy()

    if (accountSigner) {
      const result = await strategy.parse(accountSigner, {
        ...transactionRequest,
        data: undefined,
      })

      expect(result).toBeNull()
    }
  })

  it('should return null if it could not find the method definition', async () => {
    const customFunctionData =
      '0xa9959cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c93400000000000000000000000000000000000000000000000000038d7ea4c68000'

    const strategy = new OtherEnhanceStrategy()

    if (accountSigner) {
      const result = await strategy.parse(accountSigner, {
        ...transactionRequest,
        data: customFunctionData,
      })

      expect(result).toBeNull()
    }
  })
})
