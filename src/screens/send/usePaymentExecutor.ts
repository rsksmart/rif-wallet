import { createContext, useContext, useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { UnspentTransactionType } from '@rsksmart/rif-wallet-bitcoin'

import { RIFWallet } from 'lib/core'
import { IApiTransaction } from 'lib/rifWalletServices/RIFWalletServicesTypes'

import { useAppDispatch } from 'store/storeUtils'
import {
  addPendingTransaction,
  modifyTransaction,
  IApiTransactionWithExtras,
} from 'store/slices/transactionsSlice'

import { TransactionInformation } from './TransactionInfo'
import { transferBitcoin } from './transferBitcoin'
import { transfer } from './transferTokens'
import { MixedTokenAndNetworkType, OnSetTransactionStatusChange } from './types'

import { TransactionInformation } from './TransactionInfo'
import { transferBitcoin } from './transferBitcoin'
import { transfer } from './transferTokens'
import { MixedTokenAndNetworkType, OnSetTransactionStatusChange } from './types'

interface IPaymentExecutorContext {
  setUtxosGlobal: (utxos: UnspentTransactionType[]) => void
  setBitcoinBalanceGlobal: (balance: number) => void
}
export const PaymentExecutorContext = createContext<IPaymentExecutorContext>({
  setUtxosGlobal: () => {},
  setBitcoinBalanceGlobal: () => {},
})

export const usePaymentExecutorContext = () => {
  return useContext(PaymentExecutorContext)
}

export const usePaymentExecutor = () => {
  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionInformation | null>(null)
  const [error, setError] = useState<string | null | { message: string }>()
  const [utxos, setUtxos] = useState<UnspentTransactionType[]>([])
  const [bitcoinBalance, setBitcoinBalance] = useState<number>(Number(0))
  const dispatch = useAppDispatch()
  const [transactionStatusChange, setTransactionStatusChange] = useState<
    Parameters<OnSetTransactionStatusChange>[0] | null
  >(null)
  const executePayment = ({
    token,
    amount,
    to,
    wallet,
    chainId,
  }: {
    token: MixedTokenAndNetworkType
    amount: BigNumber
    to: string
    wallet: RIFWallet
    chainId: number
  }) => {
    switch (true) {
      case 'isBitcoin' in token:
        transferBitcoin({
          satoshisToPay: amount,
          onSetCurrentTransaction: setCurrentTransaction,
          onSetError: setError,
          bip: token.bips[0],
          to,
          utxos,
          balance: bitcoinBalance,
        })
        break
      default:
        transfer({
          token,
          amount: amount.toString(),
          to,
          wallet,
          chainId,
          onSetCurrentTransaction: setCurrentTransaction,
          onSetError: setError,
          onSetTransactionStatusChange: setTransactionStatusChange,
        })
        break
    }
  }

  // When a pending RIF transaction is sent - add it to redux
  useEffect(() => {
    if (transactionStatusChange !== null) {
      switch (transactionStatusChange.txStatus) {
        case 'PENDING':
          const {
            hash,
            data,
            from,
            gasPrice,
            nonce,
            value,
            type,
            symbol,
            finalAddress,
            enhancedAmount,
          } = transactionStatusChange
          const originTransaction: IApiTransactionWithExtras = {
            blockHash: '',
            blockNumber: 0,
            gas: 0,
            input: '',
            timestamp: Number(Date.now().toString().substring(0, 10)),
            transactionIndex: 0,
            txId: '',
            to: finalAddress as string,
            hash,
            data,
            from,
            gasPrice: gasPrice?.toString() || '',
            nonce,
            value: value.toString(),
            txType: type?.toString() || '',
            symbol,
            finalAddress,
            enhancedAmount,
          }
          dispatch(addPendingTransaction(originTransaction))
          break
        case 'CONFIRMED':
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { txStatus, ...restOfTransaction } = transactionStatusChange
          const {
            blockHash,
            blockNumber,
            gasUsed,
            transactionHash,
            transactionIndex,
          } = restOfTransaction
          const updatedOriginTransaction: Partial<IApiTransaction> &
            Pick<IApiTransaction, 'hash'> = {
            gas: gasUsed.toNumber(),
            hash: transactionHash as string,
            blockHash,
            blockNumber,
            transactionIndex: transactionIndex,
            receipt: restOfTransaction,
          }
          dispatch(modifyTransaction(updatedOriginTransaction))
          break
      }
    }
  }, [transactionStatusChange, dispatch])

  return {
    currentTransaction,
    error,
    executePayment,
    setUtxos,
    setBitcoinBalance,
  }
}
