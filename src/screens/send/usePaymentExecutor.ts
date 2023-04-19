import { createContext, useContext, useState, useEffect } from 'react'
import {
  BitcoinNetworkWithBIPRequest,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import {
  IApiTransaction,
  ITokenWithBalance,
} from '@rsksmart/rif-wallet-services'

import { useAppDispatch } from 'store/storeUtils'
import {
  addPendingTransaction,
  modifyTransaction,
  ApiTransactionWithExtras,
} from 'store/slices/transactionsSlice'
import { fetchUtxo } from 'screens/send/bitcoinUtils'

import { TransactionInformation } from './TransactionInfo'
import { transferBitcoin } from './transferBitcoin'
import { transfer } from './transferTokens'
import {
  ITokenOrBitcoinWithBIPRequest,
  OnSetTransactionStatusChange,
} from './types'

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

export const usePaymentExecutor = (
  bitcoinNetwork: BitcoinNetworkWithBIPRequest | undefined,
) => {
  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionInformation | null>(null)
  const [error, setError] = useState<string | null | { message: string }>()
  const [utxos, setUtxos] = useState<UnspentTransactionType[]>([])
  const [bitcoinBalance, setBalanceAvailable] = useState<number>(0)

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
    token: ITokenOrBitcoinWithBIPRequest
    amount: number
    to: string
    wallet: RIFWallet
    chainId: number
  }) => {
    if ('bips' in token) {
      transferBitcoin({
        btcToPay: amount,
        onSetCurrentTransaction: setCurrentTransaction,
        onSetError: setError,
        bip: token.bips[0],
        to,
        utxos,
        balance: bitcoinBalance,
      })
    } else {
      transfer({
        token: token as ITokenWithBalance,
        amount: amount.toString(),
        to,
        wallet,
        chainId,
        onSetCurrentTransaction: setCurrentTransaction,
        onSetError: setError,
        onSetTransactionStatusChange: setTransactionStatusChange,
      })
    }
  }
  // When bitcoin network changes - fetch utxos
  useEffect(() => {
    if (bitcoinNetwork) {
      fetchUtxo({
        token: bitcoinNetwork,
        onSetUtxos: setUtxos,
        onSetBalance: balance => setBalanceAvailable(balance.toNumber()),
      })
    }
  }, [bitcoinNetwork])

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
            symbol,
            finalAddress,
            enhancedAmount,
          } = transactionStatusChange
          const originTransaction: ApiTransactionWithExtras = {
            blockHash: '',
            blockNumber: 0,
            gas: 0,
            input: '',
            timestamp: Number(Date.now().toString().substring(0, 10)),
            transactionIndex: 0,
            txId: '',
            txType: 'contract call',
            to: finalAddress as string,
            hash,
            data,
            from,
            gasPrice: gasPrice?.toString() || '',
            nonce,
            value: value.toString(),
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
  }
}
