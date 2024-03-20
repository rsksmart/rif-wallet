import { BigNumber, BigNumberish } from 'ethers'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isAddress } from '@rsksmart/rsk-utils'

import { balanceToDisplay, convertTokenToUSD } from 'lib/utils'
import { RelayWallet } from 'lib/relayWallet'
import {
  OverriddableTransactionOptions,
  SendTransactionRequest,
} from 'lib/eoaWallet'

import { AppButtonBackgroundVarietyEnum } from 'components/index'
import { getTokenAddress } from 'core/config'
import { TokenSymbol } from 'screens/home/TokenImage'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { TransactionSummaryComponent } from 'screens/transactionSummary/TransactionSummaryComponent'
import { sharedColors } from 'shared/constants'
import {
  castStyle,
  errorHandler,
  formatTokenValue,
  rbtcMap,
} from 'shared/utils'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { addRecentContact } from 'store/slices/contactsSlice'
import { selectBalances } from 'store/slices/balancesSlice'
import { selectRecentRskTransactions } from 'store/slices/transactionsSlice'
import { WalletContext } from 'shared/wallet'
import { useAddress } from 'shared/hooks'
import { getCurrentChainId } from 'src/storage/ChainStorage'

import { useEnhancedWithGas } from '../useEnhancedWithGas'

const tokenToBoolMap = new Map([
  [TokenSymbol.RIF, true],
  [TokenSymbol.TRIF, true],
  [undefined, false],
])

interface Props {
  request: SendTransactionRequest
  onConfirm: () => void
  onCancel: () => void
}

const getFeeSymbol = (isMainnet: boolean, isRelayWallet: boolean) => {
  switch (isMainnet) {
    case false:
      return !isRelayWallet ? TokenSymbol.TRBTC : TokenSymbol.TRIF

    case true:
      return !isRelayWallet ? TokenSymbol.RBTC : TokenSymbol.RIF
  }
}

export const ReviewTransactionContainer = ({
  request,
  onCancel,
  onConfirm,
}: Props) => {
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const tokenPrices = useAppSelector(selectUsdPrices)
  // enhance the transaction to understand what it is:
  const { wallet } = useContext(WalletContext)
  const address = useAddress(wallet)
  const chainId = getCurrentChainId()
  const balances = useAppSelector(selectBalances)
  const pendingTransactions = useAppSelector(selectRecentRskTransactions)
  const [txCost, setTxCost] = useState<BigNumber>()
  const { t } = useTranslation()

  // this is for typescript, and should not happen as the transaction was created by the wallet instance.
  if (!wallet) {
    throw new Error('no wallet')
  }

  const txRequest = request.payload
  const { enhancedTransactionRequest, isLoaded } = useEnhancedWithGas(
    wallet,
    txRequest,
    chainId,
  )

  const {
    to = '',
    symbol = '',
    value = '0',
    functionName = '',
    gasPrice,
    gasLimit,
  } = enhancedTransactionRequest

  const feeSymbol = getFeeSymbol(chainId === 30, wallet instanceof RelayWallet)
  const feeContract = getTokenAddress(feeSymbol, chainId)

  const getTokenBySymbol = useCallback(
    (symb: string) => {
      const result = Object.values(balances).find(
        token => token.symbol.toUpperCase() === symb.toUpperCase(),
      )
      if (!result) {
        throw new Error(
          `Token with the symbol ${symb} not found on ${chainId}.`,
        )
      }
      return result
    },
    [balances, chainId],
  )

  const tokenContract = useMemo(() => {
    if (symbol) {
      try {
        return getTokenAddress(symbol, chainId)
      } catch {
        return getTokenBySymbol(symbol).contractAddress
      }
    }
    return feeContract
  }, [symbol, feeContract, chainId, getTokenBySymbol])

  const tokenQuote = tokenPrices[tokenContract]?.price
  const feeQuote = tokenPrices[feeContract]?.price

  useEffect(() => {
    if (txRequest.to && !isAddress(txRequest.to)) {
      console.log('Invalid "to" address, rejecting transaction')
      onCancel()
    }
  }, [onCancel, txRequest.to])

  useEffect(() => {
    wallet
      .estimateGas(txRequest, feeContract)
      .then(setTxCost)
      .catch(err => errorHandler(err))
  }, [txRequest, wallet, feeContract])

  const confirmTransaction = useCallback(async () => {
    dispatch(addRecentContact(to))
    if (!txCost) {
      throw new Error('token cost has not been estimated')
    }

    const confirmObject: OverriddableTransactionOptions = {
      gasPrice: BigNumber.from(gasPrice),
      gasLimit: BigNumber.from(gasLimit),
      tokenPayment: {
        tokenContract: feeContract,
        tokenAmount: txCost,
      },
      pendingTxsCount: pendingTransactions.length,
    }

    try {
      await request.confirm(confirmObject)
      onConfirm()
    } catch (err: unknown) {
      errorHandler(err)
    }
  }, [
    dispatch,
    txCost,
    gasPrice,
    gasLimit,
    feeContract,
    request,
    onConfirm,
    to,
    pendingTransactions,
  ])

  const cancelTransaction = useCallback(() => {
    request.reject('Transaction rejected')
    onCancel()
  }, [onCancel, request])

  const data: TransactionSummaryScreenProps = useMemo(() => {
    const feeValue = txCost ? balanceToDisplay(txCost, 18) : '0'
    const rbtcFeeValue =
      txCost && rbtcMap.get(feeSymbol)
        ? formatTokenValue(txCost.toString())
        : undefined
    let insufficientFunds = false

    if (
      tokenToBoolMap.get(symbol as TokenSymbol) &&
      wallet instanceof RelayWallet
    ) {
      insufficientFunds =
        Number(value) + Number(feeValue) > Number(balances[feeContract].balance)
    } else {
      insufficientFunds =
        Number(feeValue) > Number(balances[feeContract].balance)
    }

    if (insufficientFunds) {
      Alert.alert(t('transaction_summary_insufficient_funds'))
    }

    const convertToUSD = (
      amount: string | BigNumberish,
      quote: number,
    ): number => convertTokenToUSD(Number(amount), quote)

    // usd values
    const tokenUsd = convertToUSD(value, tokenQuote)
    const feeUsd = convertToUSD(feeValue, feeQuote)
    const totalUsd = tokenUsd + feeUsd

    const totalToken =
      symbol === feeSymbol ? Number(value) + Number(feeValue) : Number(value)

    return {
      transaction: {
        tokenValue: {
          symbol: symbol || feeSymbol,
          symbolType: 'icon',
          balance: value.toString(),
        },
        usdValue: {
          symbol: '$',
          symbolType: 'usd',
          balance: tokenUsd,
        },
        fee: {
          symbol: feeSymbol,
          tokenValue: rbtcFeeValue ?? feeValue,
          usdValue: feeUsd,
        },
        totalToken,
        totalUsd,
        time: 'approx 1 min',
        to,
      },
      buttons: [
        {
          title: t('transaction_summary_title_confirm_button_title'),
          onPress: confirmTransaction,
          color: sharedColors.white,
          textColor: sharedColors.black,
          accessibilityLabel: 'Confirm',
          disabled: insufficientFunds,
        },
        {
          style: { marginTop: 10 },
          title: t('transaction_summary_title_cancel_button_title'),
          onPress: cancelTransaction,
          backgroundVariety: AppButtonBackgroundVarietyEnum.OUTLINED,
          accessibilityLabel: 'Cancel',
        },
      ],
      functionName,
    }
  }, [
    feeContract,
    balances,
    txCost,
    value,
    tokenQuote,
    feeQuote,
    symbol,
    feeSymbol,
    to,
    t,
    confirmTransaction,
    cancelTransaction,
    functionName,
    wallet,
  ])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TransactionSummaryComponent
        {...data}
        isLoaded={isLoaded && txCost !== undefined}
        address={address}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    width: '100%',
    height: '100%',
    zIndex: 999,
    position: 'absolute',
  }),
})
