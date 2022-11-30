import BIP from '../../lib/bitcoin/BIP'
import { useRef, useState } from 'react'
import { IBitcoinTransaction } from './types'
import { BitcoinTransactionType } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { BigNumber, utils } from 'ethers'

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

const useBitcoinTransactionsHandler = ({
  bip,
  pageSize = 10,
  page = 1,
  shouldMergeTransactions = false,
}: useBitcoinTransactionsHandlerType) => {
  const [transactions, setTransactions] = useState<Array<IBitcoinTransaction>>(
    [],
  )
  const pageRef = useRef({
    pageSize,
    page,
    totalPages: 1,
  })
  const fetchTransactions = async (
    pageSizeTransaction?: number,
    pageNumberTransaction?: number,
  ): Promise<BitcoinTransactionType[]> => {
    pageRef.current.pageSize = pageSizeTransaction || pageRef.current.pageSize
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
    return data.transactions
  }

  const fetchNextTransactionPage = () => {
    pageRef.current.page = pageRef.current.page + 1
    // If the next page is greater than the total pages, don't do anything
    if (pageRef.current.page > pageRef.current.totalPages) {
      return
    }
    return fetchTransactions()
  }
  return { fetchNextTransactionPage, fetchTransactions, transactions, pageRef }
}

export default useBitcoinTransactionsHandler
