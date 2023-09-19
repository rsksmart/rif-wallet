import {
  OverriddableTransactionOptions,
  SendTransactionRequest,
} from '@rsksmart/rif-wallet-core'
import { BigNumber, constants } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isAddress } from '@rsksmart/rsk-utils'

import { balanceToDisplay, convertTokenToUSD } from 'lib/utils'

import { AppButtonBackgroundVarietyEnum } from 'components/index'
import { getTokenAddress } from 'core/config'
import { TokenSymbol } from 'screens/home/TokenImage'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { TransactionSummaryComponent } from 'screens/transactionSummary/TransactionSummaryComponent'
import { sharedColors } from 'shared/constants'
import { chainTypesById } from 'shared/constants/chainConstants'
import { castStyle, errorHandler } from 'shared/utils'
import { selectWalletState } from 'store/slices/settingsSlice'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { addRecentContact } from 'store/slices/contactsSlice'
import { selectBalances } from 'store/slices/balancesSlice'

import useEnhancedWithGas from '../useEnhancedWithGas'

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

export const ReviewTransactionContainer = ({
  request,
  onCancel,
  onConfirm,
}: Props) => {
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const tokenPrices = useAppSelector(selectUsdPrices)
  // enhance the transaction to understand what it is:
  const { wallet, chainId } = useAppSelector(selectWalletState)
  const balances = useAppSelector(selectBalances)
  const [txCostInRif, setTxCostInRif] = useState<BigNumber>()
  const { t } = useTranslation()

  // this is for typescript, and should not happen as the transaction was created by the wallet instance.
  if (!wallet) {
    throw new Error('no wallet')
  }

  const txRequest = request.payload[0]
  const { enhancedTransactionRequest, isLoaded } = useEnhancedWithGas(
    wallet,
    txRequest,
  )

  const {
    to = '',
    symbol = '',
    value = '0',
    functionName = '',
    gasPrice,
    gasLimit,
  } = enhancedTransactionRequest

  const isMainnet = chainTypesById[chainId] === ChainTypeEnum.MAINNET

  const rbtcSymbol = isMainnet ? TokenSymbol.RBTC : TokenSymbol.TRBTC
  const feeSymbol = isMainnet ? TokenSymbol.RIF : TokenSymbol.TRIF
  const feeContract = getTokenAddress(feeSymbol, chainTypesById[chainId])

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
    const rbtcAddress = constants.AddressZero
    if (symbol === rbtcSymbol) {
      return rbtcAddress
    }
    if (symbol) {
      try {
        return getTokenAddress(symbol, chainTypesById[chainId])
      } catch {
        return getTokenBySymbol(symbol).contractAddress
      }
    }
    return feeContract
  }, [symbol, rbtcSymbol, feeContract, chainId, getTokenBySymbol])

  const tokenQuote = tokenPrices[tokenContract]?.price
  const feeQuote = tokenPrices[feeContract]?.price

  useEffect(() => {
    if (txRequest.to && !isAddress(txRequest.to)) {
      console.log('Invalid "to" address, rejecting transaction')
      onCancel()
    }
  }, [onCancel, txRequest.to])

  useEffect(() => {
    wallet.rifRelaySdk
      .estimateTransactionCost(txRequest, feeContract)
      .then(setTxCostInRif)
      .catch(err => errorHandler(err))
  }, [txRequest, wallet.rifRelaySdk, feeContract])

  const confirmTransaction = useCallback(async () => {
    dispatch(addRecentContact(to))
    if (!txCostInRif) {
      throw new Error('token cost has not been estimated')
    }

    const confirmObject: OverriddableTransactionOptions = {
      gasPrice: BigNumber.from(gasPrice),
      gasLimit: BigNumber.from(gasLimit),
      tokenPayment: {
        tokenContract: feeContract,
        tokenAmount: txCostInRif,
      },
    }

    try {
      await request.confirm(confirmObject)
      onConfirm()
    } catch (err: unknown) {
      errorHandler(err)
    }
  }, [
    dispatch,
    txCostInRif,
    gasPrice,
    gasLimit,
    feeContract,
    request,
    onConfirm,
    to,
  ])

  const cancelTransaction = useCallback(() => {
    request.reject('Transaction rejected')
    onCancel()
  }, [onCancel, request])

  const data: TransactionSummaryScreenProps = useMemo(() => {
    const convertToUSD = (tokenValue: number, quote = 0) =>
      convertTokenToUSD(tokenValue, quote, true).toFixed(2)

    const feeValue = txCostInRif ? balanceToDisplay(txCostInRif, 18, 0) : '0'

    let insufficientFunds = false

    if (tokenToBoolMap.get(symbol as TokenSymbol)) {
      insufficientFunds =
        Number(value) + Number(feeValue) > Number(balances[feeContract].balance)
    } else {
      insufficientFunds =
        Number(feeValue) > Number(balances[feeContract].balance)
    }

    if (insufficientFunds) {
      Alert.alert(t('transaction_summary_insufficient_funds'))
    }

    // get usd values
    const tokenUsd = convertToUSD(Number(value), tokenQuote)
    const feeUsd = convertToUSD(Number(feeValue), feeQuote)

    return {
      transaction: {
        tokenValue: {
          balance: value.toString(),
          symbolType: 'icon',
          symbol: symbol || feeSymbol,
        },
        usdValue: {
          balance: tokenUsd,
          symbolType: 'usd',
          symbol: '$',
        },
        fee: {
          tokenValue: feeValue,
          usdValue: feeUsd,
          symbol: feeSymbol,
        },
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
    txCostInRif,
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
  ])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TransactionSummaryComponent
        {...data}
        isLoaded={isLoaded && txCostInRif !== undefined}
        wallet={wallet}
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
