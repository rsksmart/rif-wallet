import { TransactionRequest } from '@ethersproject/abstract-provider'
import { renderHook, act } from '@testing-library/react-hooks'
import { BigNumber } from 'ethers'
import { setupTest } from '../../../testLib/setup'
import { RIFWallet } from '../../lib/core'

import useEnhancedWithGas from './useEnhancedWithGas'

describe('hook: useEnhancedWithGas', function (this: {
  tx: TransactionRequest
  rifWallet: RIFWallet
}) {
  beforeEach(async () => {
    const mock = await setupTest()
    this.rifWallet = mock.rifWallet

    this.tx = {
      to: '0x123',
      from: '0x456',
      value: 0,
    }

    jest
      .spyOn(this.rifWallet.smartWallet, 'estimateDirectExecute')
      .mockResolvedValue(BigNumber.from(600))

    // @ts-ignore - provider does exist
    // eslint-disable-next-line prettier/prettier
    jest.spyOn(this.rifWallet.provider, 'getGasPrice').mockResolvedValue(BigNumber.from(2000))
  })

  const runHook = async (tx: TransactionRequest) => {
    const { result, waitForNextUpdate } = await renderHook(
      async () => await useEnhancedWithGas(this.rifWallet, tx),
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
  })
})
