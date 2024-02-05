import { useState, useEffect } from 'react'
import {
  convertBtcToSatoshi,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { fetchBitcoinTransactions } from 'store/slices/transactionsSlice'
import {
  fetchAddressToReturnFundsTo,
  fetchUtxo,
} from 'screens/send/bitcoinUtils'
import { TokenBalanceObject } from 'store/slices/balancesSlice/types'
import {
  addAddressToUsedBitcoinAddresses,
  selectWholeSettingsState,
} from 'store/slices/settingsSlice'
import { handleTransactionStatusChange } from 'store/shared/utils'
import { Wallet } from 'shared/wallet'

import { transferBitcoin } from './transferBitcoin'
import { transfer } from './transferTokens'
import { TransactionInformation } from './types'

interface ExecutePayment {
  token: TokenBalanceObject
  amount: number
  to: string
  wallet: Wallet
  chainId: number
}
/**
 * This function will make sure that the user has enough inputs (balance) to send a payment
 */
const checkBitcoinPaymentForErrors = (
  utxos: UnspentTransactionType[],
  amountToSend: number,
): string | void => {
  // Check if user has inputs
  if (utxos.length === 0) {
    return 'bitcoin_validation_zero_inputs'
  }
  // Compare current amountToSent versus current input values
  let currentAmount = convertBtcToSatoshi(amountToSend.toString())
  for (const utxo of utxos) {
    currentAmount = currentAmount.sub(utxo.value)
    if (currentAmount.isNegative()) {
      break
    }
  }
  // If amount is not negative, user is trying to send more balance than he has available
  if (!currentAmount.isNegative()) {
    return 'bitcoin_validation_inputs_not_enough'
  }
}

export const usePaymentExecutor = (
  bitcoinNetwork: TokenBalanceObject | undefined,
) => {
  const [currentTransaction, setCurrentTransaction] =
    useState<TransactionInformation | null>(null)
  const [error, setError] = useState<string | null | { message: string }>()
  const [utxos, setUtxos] = useState<UnspentTransactionType[]>([])
  const [addressToReturnRemainingAmount, setAddressToReturnRemainingAmount] =
    useState<string>('')
  const [bitcoinBalance, setBalanceAvailable] = useState<number>(0)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { usedBitcoinAddresses } = useAppSelector(selectWholeSettingsState)

  const onBitcoinTransactionSuccess = ({
    addressUsed,
  }: {
    addressUsed: string
  }) => {
    dispatch(addAddressToUsedBitcoinAddresses(addressUsed))
    // Easy fix to avoid dispatching a lot: Fetch latest 3 bitcoin transactions after 3s of the tx being completed
    setTimeout(() => {
      dispatch(fetchBitcoinTransactions({ pageSize: 3 }))
    }, 3000)
  }

  const executePayment = ({
    token,
    amount,
    to,
    wallet,
    chainId,
  }: ExecutePayment) => {
    if ('bips' in token) {
      const hasError = checkBitcoinPaymentForErrors(utxos, amount)
      if (hasError) {
        setError(t(hasError))
        return
      }
      transferBitcoin({
        btcToPay: amount,
        onSetCurrentTransaction: setCurrentTransaction,
        onSetError: setError,
        bip: token.bips[0],
        to,
        utxos,
        balance: bitcoinBalance,
        addressToReturnRemainingAmount,
        onBitcoinTransactionSuccess,
      })
    } else {
      transfer({
        token: token as unknown as ITokenWithBalance,
        amount: amount.toString(),
        to,
        wallet,
        chainId,
        onSetCurrentTransaction: setCurrentTransaction,
        onSetError: setError,
        onSetTransactionStatusChange: handleTransactionStatusChange(dispatch),
      })
    }
  }
  // When bitcoin network changes - fetch utxos
  // and also set the return address
  useEffect(() => {
    if (bitcoinNetwork && 'satoshis' in bitcoinNetwork) {
      fetchUtxo({
        token: bitcoinNetwork,
        onSetUtxos: setUtxos,
        onSetBalance: balance => setBalanceAvailable(balance.toNumber()),
      })
      fetchAddressToReturnFundsTo({
        token: bitcoinNetwork,
        onSetAddress: setAddressToReturnRemainingAmount,
        usedBitcoinAddresses,
      })
    }
  }, [bitcoinNetwork, usedBitcoinAddresses])

  return {
    currentTransaction,
    error,
    executePayment,
    bitcoinBalance,
  }
}
