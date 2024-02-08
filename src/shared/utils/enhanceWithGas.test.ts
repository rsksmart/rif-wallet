import { TransactionRequest } from '@ethersproject/abstract-provider'
import { act } from '@testing-library/react-hooks'
import { BigNumber, Wallet, providers } from 'ethers'
import { useSelector } from 'react-redux'

import { enhanceWithGas } from './enhanceWithGas'

jest.mock('react-redux')

describe('enhancedWithGas util', function (this: {
  tx: TransactionRequest
  wallet: Wallet
}) {
  const useSelectorMock = useSelector as jest.MockedFunction<typeof useSelector>
  useSelectorMock.mockImplementation(cb => cb({ settings: { chainId: 31 } }))
  beforeEach(async () => {
    const provider = new providers.JsonRpcProvider('http://127.0.0.1:8545')
    this.wallet = Wallet.createRandom().connect(provider)
    useSelectorMock.mockClear()

    this.tx = {
      from: '0xa2193a393aa0c94a4d52893496f02b56c61c36a1',
      to: '0xfbd1cb816f073c554296bfff2be2ddb66ced83fd',
      value: 0,
    }

    jest
      .spyOn(this.wallet, 'estimateGas')
      .mockResolvedValue(BigNumber.from(600))

    if (this.wallet.provider) {
      jest
        .spyOn(this.wallet.provider, 'getGasPrice')
        .mockResolvedValue(BigNumber.from(2000))
    }
  })

  describe('gasLimit', () => {
    it('chooses the higher gasLimit when preset', async () => {
      await act(async () => {
        const txEnhanced = await enhanceWithGas(
          this.wallet,
          {
            ...this.tx,
            gasLimit: 1000,
          },
          31,
        )

        expect(txEnhanced.gasLimit).toBe('1000')
      })
    })

    it('chooses the higher gasLimit when estimated', async () => {
      await act(async () => {
        const txEnhanced = await enhanceWithGas(
          this.wallet,
          {
            ...this.tx,
            gasLimit: 20,
          },
          31,
        )

        expect(txEnhanced.gasLimit).toBe('600')
      })
    })
  })

  describe('gasPrice', () => {
    it('chooses the higher gasPrice when preset', async () => {
      await act(async () => {
        const txEnhanced = await enhanceWithGas(
          this.wallet,
          {
            ...this.tx,
            gasPrice: 4000,
          },
          31,
        )

        expect(txEnhanced.gasPrice).toBe('4000')
      })
    })

    it('chooses the higher gasPrice when estimates', async () => {
      await act(async () => {
        const txEnhanced = await enhanceWithGas(
          this.wallet,
          {
            ...this.tx,
            gasPrice: 14,
          },
          31,
        )

        expect(txEnhanced.gasPrice).toBe('2020')
      })
    })

    it('should return  originalTx if the tx.to address is not valid', async () => {
      await act(async () => {
        const tx = {
          ...this.tx,
          to: '0x',
        }

        const txEnhanced = await enhanceWithGas(this.wallet, tx, 31)

        expect(tx).toEqual(txEnhanced)
      })
    })
  })
})
