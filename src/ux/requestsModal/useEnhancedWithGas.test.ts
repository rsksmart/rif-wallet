import { TransactionRequest } from '@ethersproject/abstract-provider'
import { renderHook, act } from '@testing-library/react-hooks'
import { BigNumber, Wallet, providers } from 'ethers'
import { useSelector } from 'react-redux'

import useEnhancedWithGas from './useEnhancedWithGas'

jest.mock('react-redux')

describe('hook: useEnhancedWithGas', function (this: {
  tx: TransactionRequest
  rifWallet: Wallet
}) {
  const useSelectorMock = useSelector as jest.MockedFunction<typeof useSelector>
  useSelectorMock.mockImplementation(cb => cb({ settings: { chainId: 31 } }))
  beforeEach(async () => {
    const provider = new providers.JsonRpcProvider('http://127.0.0.1:8545')
    this.rifWallet = Wallet.createRandom().connect(provider)
    useSelectorMock.mockClear()

    this.tx = {
      from: '0xa2193a393aa0c94a4d52893496f02b56c61c36a1',
      to: '0xfbd1cb816f073c554296bfff2be2ddb66ced83fd',
      value: 0,
    }

    jest
      .spyOn(this.rifWallet, 'estimateGas')
      .mockResolvedValue(BigNumber.from(600))

    if (this.rifWallet.provider) {
      jest
        .spyOn(this.rifWallet.provider, 'getGasPrice')
        .mockResolvedValue(BigNumber.from(2000))
    }
  })

  const runHook = async (tx: TransactionRequest) => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEnhancedWithGas(this.rifWallet, tx),
    )

    await waitForNextUpdate()

    return result.current
  }

  it('renders the hook with default values', async () => {
    await act(async () => {
      const txEnhanced = await runHook(this.tx)

      expect(txEnhanced.isLoaded).toBeTruthy()
      expect(txEnhanced.enhancedTransactionRequest).toMatchObject({
        ...this.tx,
        value: '0',
        gasPrice: '2020',
        gasLimit: '600',
      })
    })
  })

  describe('gasLimit', () => {
    it('chooses the higher gasLimit when preset', async () => {
      await act(async () => {
        const txEnhanced = await runHook({
          ...this.tx,
          gasLimit: 1000,
        })

        expect(txEnhanced.enhancedTransactionRequest.gasLimit).toBe('1000')
      })
    })

    it('chooses the higher gasLimit when estimated', async () => {
      await act(async () => {
        const txEnhanced = await runHook({
          ...this.tx,
          gasLimit: 20,
        })

        expect(txEnhanced.enhancedTransactionRequest.gasLimit).toBe('600')
      })
    })
  })

  describe('gasPrice', () => {
    it('chooses the higher gasPrice when preset', async () => {
      await act(async () => {
        const txEnhanced = await runHook({
          ...this.tx,
          gasPrice: 4000,
        })

        expect(txEnhanced.enhancedTransactionRequest.gasPrice).toBe('4000')
      })
    })

    it('chooses the higher gasPrice when estimates', async () => {
      await act(async () => {
        const txEnhanced = await runHook({
          ...this.tx,
          gasPrice: 14,
        })

        expect(txEnhanced.enhancedTransactionRequest.gasPrice).toBe('2020')
      })
    })

    it('should not call estimateGas if the tx.to address is not valid', async () => {
      await act(async () => {
        const txEnhanced = await runHook({
          ...this.tx,
          to: '0x',
        })

        expect(txEnhanced.enhancedTransactionRequest.gasLimit).toBe('0')
      })
    })
  })
})
