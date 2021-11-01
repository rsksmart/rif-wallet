import { providers, BigNumber } from 'ethers'
import { Signer } from '@ethersproject/abstract-signer'

import { RBTCEnhanceStrategy } from './RBTCEnhanceStrategy'

const Config = {
  BLOCKCHAIN_HTTP_URL: 'HTTP://127.0.0.1:8545',
}

const getJsonRpcProvider = async (): Promise<providers.JsonRpcProvider> => {
  return new providers.JsonRpcProvider(Config.BLOCKCHAIN_HTTP_URL)
}

const getSigner = async (index: number = 0) => {
  const provider = await getJsonRpcProvider()
  return provider.getSigner(index)
}

describe('RBTC Enhance Strategy', () => {
  const initialBalance = BigNumber.from(100)
  let transactionRequest = {
    from: '0x2750de12a98AD6BA53bE8d0DbE4a595d63Fdf985',
    to: '0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934',
    value: BigNumber.from(1000000000000000), // 0.001 in decimals
  }
  let accountSigner: Signer | null = null

  beforeEach(async () => {
    accountSigner = await getSigner(7)
  })

  it('should return transaction info enhanced', async () => {
    const strategy = new RBTCEnhanceStrategy()

    const result = await strategy.parse(accountSigner!, transactionRequest)

    expect(result).not.toBeNull()
    expect(result!.from).toBe(transactionRequest.from)
    expect(result!.to).toBe('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934')
    expect(result!.balance).toBe(initialBalance.toString())
    expect(result!.value).toBe('0.001')
  })
})
