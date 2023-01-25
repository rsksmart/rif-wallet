import { useRef, useState, useCallback } from 'react'
import { BigNumber, utils } from 'ethers'
import { BIP } from '@rsksmart/rif-wallet-bitcoin'

import { BitcoinTransactionType } from 'lib/rifWalletServices/RIFWalletServicesTypes'

import { IBitcoinTransaction } from './types'

function transformTransaction(bip: BIP) {
  return function (transaction: BitcoinTransactionType): IBitcoinTransaction {
    return {
      ...transaction,
      isBitcoin: true,
      symbol: bip.network.symbol,
      status: transaction.confirmations > 0 ? 'success' : 'pending',
      to: transaction.vout[0].addresses[0],
      valueBtc: utils.formatUnits(BigNumber.from(transaction.value), 8),
      id: transaction.txid,
      sortTime: transaction.blockTime,
    }
  }
}

type useBitcoinTransactionsHandlerType = {
  bip: BIP
  pageSize?: number
  page?: number
  shouldMergeTransactions?: boolean
}

type ApiStatuses = 'fetching' | 'success' | 'error' | 'idle'

export const useBitcoinTransactionsHandler = ({
  bip,
  pageSize = 10,
  page = 1,
  shouldMergeTransactions = false,
}: useBitcoinTransactionsHandlerType) => {
  const [transactions, setTransactions] = useState<Array<IBitcoinTransaction>>(
    [],
  )
  const [apiStatus, setApiStatus] = useState<ApiStatuses>('idle')
  const pageRef = useRef({
    pageSize,
    page,
    totalPages: 1,
  })
  const fetchTransactions = useCallback(
    async (
      pageSizeTransaction?: number,
      pageNumberTransaction?: number,
    ): Promise<BitcoinTransactionType[]> => {
      setApiStatus('fetching')
      try {
        pageRef.current.pageSize =
          pageSizeTransaction || pageRef.current.pageSize
        pageRef.current.page = pageNumberTransaction || pageRef.current.page
        const data = await bip.fetchTransactions(
          pageRef.current.pageSize,
          pageRef.current.page,
        )
        pageRef.current.totalPages = data.totalPages
        const transactionsTransformed = data.transactions.map(
          transformTransaction(bip),
        )
        if (shouldMergeTransactions && pageRef.current.page !== 1) {
          setTransactions(cur => [...cur, ...transactionsTransformed])
        } else {
          setTransactions(transactionsTransformed)
        }
        setApiStatus('success')
        return data.transactions
      } catch (error) {
        setApiStatus('error')
        return []
      }
    },
    [bip, shouldMergeTransactions],
  )
  const fetchNextTransactionPage = useCallback(() => {
    pageRef.current.page = pageRef.current.page + 1
    // If the next page is greater than the total pages, don't do anything
    if (pageRef.current.page > pageRef.current.totalPages) {
      return
    }
    return fetchTransactions()
  }, [fetchTransactions])

  return {
    fetchNextTransactionPage,
    fetchTransactions,
    transactions,
    pageRef,
    apiStatus,
  }
}
