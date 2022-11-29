import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { RIFSocketsProvider, useSocketsState } from './RIFSockets'
import { Provider, store } from 'store'

describe('Live Subscriptions Context', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <RIFSocketsProvider>{children}</RIFSocketsProvider>
    </Provider>
  )

  describe('useSusbscription hook', () => {
    test('expect useSubscription to throw and error when used without SubscriptionsProvider', () => {
      const { result } = renderHook(() => useSocketsState())
      expect(result.error?.message).toBe(
        'useSubscription must be used within a SubscriptionsProvider',
      )
    })

    test('expect useSubscription to dispatch new transaction and update state', () => {
      const { result } = renderHook(() => useSocketsState(), { wrapper })
      expect(
        result.current.state.transactions.activityTransactions.length,
      ).toEqual(0)
      act(() => {
        result.current.dispatch({
          type: 'newTransaction',
          payload: {
            originTransaction: {
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
                logsBloom: '',
              },
              txType: 'normal',
              txId: '',
            },
            enhancedTransaction: undefined,
          },
        })
      })
      expect(
        result.current.state.transactions.activityTransactions.length,
      ).toEqual(1)
    })
  })
})
