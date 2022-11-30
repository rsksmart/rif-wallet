import { createContext, useContext, useState } from 'react'
import { TransactionInformation } from './TransactionInfo'
import { transferBitcoin } from './transferBitcoin'
import { transfer } from './transferTokens'
import { UnspentTransactionType } from '../../lib/bitcoin/types'
import { BigNumber } from 'ethers'
import { RIFWallet } from 'src/lib/core'
import { MixedTokenAndNetworkType } from './types'

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
