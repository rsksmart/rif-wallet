import BIP from '../../lib/bitcoin/BIP'
import React, { useState } from 'react'
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
const useBitcoinTransactionsHandler = ({
  bip,
  pageSize = 10,
  page = 1,
}: {
  bip: BIP
  pageSize?: number
  page?: number
}) => {
  const [transactions, setTransactions] = useState<Array<IBitcoinTransaction>>(
    [],
  )
  const pageRef = React.useRef({
    pageSize,
    page,
  })
  const fetchTransactions = async (
    pageSizeTransaction = null,
    pageNumberTransaction = null,
  ) => {
    pageRef.current = {
      pageSize: pageSizeTransaction || pageRef.current.pageSize,
      page: pageNumberTransaction || pageRef.current.page,
    }
    const data = await bip.fetchTransactions(
      pageRef.current.pageSize,
      pageRef.current.page,
    )
    setTransactions(data.transactions.map(transformTransaction(bip)))
    return data.transactions
  }

  const fetchNextTransactionPage = () => {
    pageRef.current.page = pageRef.current.page + 1
    return fetchTransactions()
  }
  return { fetchNextTransactionPage, fetchTransactions, transactions }
}

export default useBitcoinTransactionsHandler
