import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { RIFSocketsProvider, useSocketsState } from './RIFSocketsContext'

describe('Live Subscriptions Context', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => <RIFSocketsProvider>{children}</RIFSocketsProvider>

  describe('useSusbscription hook', () => {
    test('expect useSubscription to throw and error when used without SubscriptionsProvider', () => {
      const { result } = renderHook(() => useSocketsState())
      expect(result.error?.message).toBe('useSubscription must be used within a SubscriptionsProvider')
    })

    test('expect useSubscription to dispatch new price and update state', () => {
      const { result } = renderHook(() => useSocketsState(), { wrapper })
      expect(Object.keys(result.current.state.prices).length).toEqual(0)
      act(() => {
        result.current.dispatch({ type: 'newPrice', payload: { '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe': { price: 0.2239, lastUpdated: '2021-12-20-T21:56:08.000Z' } } })
      })
      expect(Object.keys(result.current.state.prices).length).toEqual(1)
      expect(Object.keys(result.current.state.prices)[0]).toBe('0x19f64674d8a5b4e652319f5e239efd3bc969a1fe')
    })

    test('expect useSubscription to dispatch new balance and update state', () => {
      const { result } = renderHook(() => useSocketsState(), { wrapper })
      expect(result.current.state.balances.length).toEqual(0)
      act(() => {
        result.current.dispatch({ type: 'newBalance', payload: { name: 'tRIF Token', symbol: 'tRIF', contractAddress: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe', decimals: 18, balance: '' } })
      })
      expect(result.current.state.balances.length).toEqual(1)
      expect(result.current.state.balances[0].name).toBe('tRIF Token')
    })

    test('expect useSubscription to dispatch new transaction and update state', () => {
      const { result } = renderHook(() => useSocketsState(), { wrapper })
      expect(result.current.state.transactions.length).toEqual(0)
      act(() => {
        result.current.dispatch({
          type: 'newTransaction', payload: {
            _id: '',
            hash: '0x09073e82ebe101dce197731e2270bbad56b4da279edeeb5ed2671eccf723eec0',
            nonce: 2452059,
            blockHash: '',
            blockNumber: 2452060,
            transactionIndex: 1,
            from: '0x0000000000000000000000000000000000000000',
            to: '0x0000000000000000000000000000000001000008',
            gas: 0,
            gasPrice: '0x3938700',
            value: '0xb1a2bc2ec50000',
            input: '0x',
            v: '',
            r: '',
            s: '',
            timestamp: 1640036267,
            receipt: {
              transactionHash: '',
              transactionIndex: 1,
              blockHash: '',
              blockNumber: 2434238,
              cumulativeGasUsed: 112668,
              gasUsed: 21000,
              contractAddress: null,
              logs: [],
              from: '',
              to: '',
              status: '0x1',
              logsBloom: ''

            },
            txType: 'normal',
            txId: '',

          }
        })
      })

      expect(result.current.state.transactions.length).toEqual(1)

    })

  })
})