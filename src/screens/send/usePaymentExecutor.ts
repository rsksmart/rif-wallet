import { createContext, useContext, useState } from 'react'
import { transactionInfo } from './TransactionInfo'
import { transferBitcoin } from './transferBitcoin'
import { transfer } from './transferTokens'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { UnspentTransactionType } from '../../lib/bitcoin/types'

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
    useState<transactionInfo | null>(null)
  const [error, setError] = useState<Error>()
  const [utxos, setUtxos] = useState<UnspentTransactionType[]>([])
  const [bitcoinBalance, setBitcoinBalance] = useState<number>(Number(0))
  const executePayment = ({
    token,
    amount,
    to,
    wallet,
    chainId,
  }: {
    [key: string]: any
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
          token: token as ITokenWithBalance,
          amount,
          to,
          wallet,
          chainId,
          onSetCurrentTransaction: setCurrentTransaction,
          onSetError: setError,
        })
        break
    }
  }

  return {
    currentTransaction,
    error,
    executePayment,
    setUtxos,
    setBitcoinBalance,
  }
}
