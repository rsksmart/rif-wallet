import { useState, useEffect } from 'react'
import {
  convertBtcToSatoshi,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'
import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  addPendingTransaction,
  modifyTransaction,
  ApiTransactionWithExtras,
  ModifyTransaction,
  fetchBitcoinTransactions,
} from 'store/slices/transactionsSlice'
import {
  fetchAddressToReturnFundsTo,
  fetchUtxo,
} from 'screens/send/bitcoinUtils'
import { AppDispatch } from 'store/index'
import { TokenBalanceObject } from 'store/slices/balancesSlice/types'
import {
  addAddressToUsedBitcoinAddresses,
  selectWholeSettingsState,
} from 'store/slices/settingsSlice'

import { transferBitcoin } from './transferBitcoin'
import { transfer } from './transferTokens'
import { OnSetTransactionStatusChange, TransactionInformation } from './types'

// Update transaction based on status
// Pending will add a pendingTransaction
// When it's done waiting, it'll modifyTransaction to update it with the receipt
export const handleReduxTransactionStatusChange =
  (dispatch: AppDispatch) =>
  (
    transactionStatusChange: Parameters<OnSetTransactionStatusChange>[0] | null,
  ) => {
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
          const {
            blockHash,
            blockNumber,
            gasUsed,
            transactionHash,
            transactionIndex,
          } = transactionStatusChange
          const updatedOriginTransaction: ModifyTransaction = {
            gas: gasUsed.toNumber(),
            hash: transactionHash,
            blockHash,
            blockNumber,
            transactionIndex: transactionIndex,
            receipt: transactionStatusChange,
          }
          dispatch(modifyTransaction(updatedOriginTransaction))
          break
      }
    }
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
  }: {
    token: TokenBalanceObject
    amount: number
    to: string
    wallet: RIFWallet
    chainId: number
  }) => {
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
        onSetTransactionStatusChange:
          handleReduxTransactionStatusChange(dispatch),
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
