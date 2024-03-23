import { BigNumber, BigNumberish } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { isAddress } from '@rsksmart/rsk-utils'
import { showMessage } from 'react-native-flash-message'

import { balanceToDisplay, convertTokenToUSD } from 'lib/utils'
import { OverriddableTransactionOptions, RelayWallet } from 'lib/relayWallet'
import { SendTransactionRequest } from 'lib/eoaWallet'

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
  getDefaultTokenContract,
  getFee,
  rbtcMap,
} from 'shared/utils'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { addRecentContact } from 'store/slices/contactsSlice'
import { selectBalances } from 'store/slices/balancesSlice'
import { selectRecentRskTransactions } from 'store/slices/transactionsSlice'
import { Wallet } from 'shared/wallet'
import {
  EnhancedTransactionRequest,
  enhanceWithGas,
} from 'shared/utils/enhanceWithGas'
import { getPopupMessage } from 'shared/popupMessage'
import { getCurrentChainId } from 'storage/ChainStorage'

const tokenToBoolMap = new Map([
  [TokenSymbol.RIF, true],
  [TokenSymbol.TRIF, true],
  [undefined, false],
])

interface Props {
  wallet: Wallet
  address: string
  request: SendTransactionRequest
  onConfirm: () => void
  onCancel: () => void
}

export const ReviewTransactionContainer = ({
  wallet,
  address,
  request,
  onCancel,
  onConfirm,
}: Props) => {
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()
  const tokenPrices = useAppSelector(selectUsdPrices)
  // enhance the transaction to understand what it is:

  const chainId = getCurrentChainId()
  const balances = useAppSelector(selectBalances)
  const pendingTransactions = useAppSelector(selectRecentRskTransactions)
  const [txCost, setTxCost] = useState<BigNumber>()
  const [enhancedTransactionRequest, setEnhancedTransactionRequest] =
    useState<EnhancedTransactionRequest>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const { t } = useTranslation()

  const txRequest = request.payload

  const {
    to = '',
    symbol = '',
    value = '0',
    functionName = '',
    gasPrice,
    gasLimit,
  } = enhancedTransactionRequest

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

    return getDefaultTokenContract(chainId)
  }, [symbol, chainId, getTokenBySymbol])

  const fee = useMemo(() => getFee(chainId, txRequest.to), [chainId, txRequest])

  const tokenQuote = tokenPrices[tokenContract]?.price
  const feeQuote = tokenPrices[fee.contractAddress]?.price

  useEffect(() => {
    if (txRequest.to && !isAddress(txRequest.to)) {
      showMessage(
        getPopupMessage(t('send_transaction_popup'), t('ok'), onCancel),
      )
    }
  }, [onCancel, txRequest.to, t])

  // this hook estimatesGas for txRequest
  useEffect(() => {
    const fn = async () => {
      try {
        const estimatedCost = await wallet.estimateGas(
          txRequest,
          fee.contractAddress,
        )

        setTxCost(estimatedCost)

        const eTx = await enhanceWithGas(wallet, txRequest, chainId)
        setEnhancedTransactionRequest(eTx)
        setIsLoaded(true)
      } catch (err) {
        console.log('ERROR WHEN ESTIMATING THE TX COST', err)
      }
    }

    fn()
  }, [txRequest, wallet, fee.contractAddress, chainId])

  const confirmTransaction = useCallback(async () => {
    dispatch(addRecentContact(to))
    if (!txCost) {
      throw new Error('token cost has not been estimated')
    }

    const confirmObject: OverriddableTransactionOptions = {
      gasPrice: BigNumber.from(gasPrice),
      gasLimit: BigNumber.from(gasLimit),
      tokenPayment: {
        tokenContract: fee.contractAddress,
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
    fee.contractAddress,
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
      txCost && rbtcMap.get(fee.symbol as TokenSymbol)
        ? formatTokenValue(txCost.toString())
        : undefined
    let insufficientFunds = false

    if (
      tokenToBoolMap.get(symbol as TokenSymbol) &&
      wallet instanceof RelayWallet
    ) {
      insufficientFunds =
        Number(value) + Number(feeValue) >
        Number(balances[fee.contractAddress].balance)
    } else {
      insufficientFunds =
        Number(feeValue) > Number(balances[fee.contractAddress].balance)
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
      symbol === fee.symbol ? Number(value) + Number(feeValue) : Number(value)

    return {
      transaction: {
        tokenValue: {
          symbol: symbol || fee.symbol,
          symbolType: 'icon',
          balance: value.toString(),
        },
        usdValue: {
          symbol: '$',
          symbolType: 'usd',
          balance: tokenUsd,
        },
        fee: {
          symbol: fee.symbol,
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
    balances,
    txCost,
    value,
    tokenQuote,
    feeQuote,
    symbol,
    fee,
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
