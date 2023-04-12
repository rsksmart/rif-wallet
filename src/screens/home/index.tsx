import RampSdk from '@ramp-network/react-native-sdk'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'
import { BIP } from '@rsksmart/rif-wallet-bitcoin'
import { useTranslation } from 'react-i18next'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'
import { useIsFocused } from '@react-navigation/native'

import { balanceToDisplay, convertBalance, getChainIdByType } from 'lib/utils'

import { toChecksumAddress } from 'components/address/lib'
import { Typography } from 'components/typography'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { colors } from 'src/styles'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import {
  changeTopColor,
  selectActiveWallet,
  selectHideBalance,
  setHideBalance,
} from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { HomeBarButtonGroup } from 'screens/home/HomeBarButtonGroup'
import { CurrencyValue, TokenBalance } from 'components/token'
import {
  getIsGettingStartedClosed,
  hasIsGettingStartedClosed,
  saveIsGettingStartedClosed,
} from 'storage/MainStorage'
import { selectTransactions } from 'store/slices/transactionsSlice'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { useBitcoinTransactionsHandler } from 'screens/activity/useBitcoinTransactionsHandler'
import useTransactionsCombiner from 'screens/activity/useTransactionsCombiner'
import { ActivityBasicRow } from 'screens/activity/ActivityRow'

import { HomeInformationBar } from './HomeInformationBar'
import { getTokenColor } from './tokenColor'
import { PortfolioComponent } from './PortfolioComponent'

export const HomeScreen = ({
  navigation,
}: HomeStackScreenProps<homeStackRouteNames.Main>) => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const dispatch = useAppDispatch()
  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)
  const bitcoinCore = useBitcoinContext()
  const { wallet, chainType } = useAppSelector(selectActiveWallet)
  const hideBalance = useAppSelector(selectHideBalance)
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined,
  )
  const [selectedTokenBalance, setSelectedTokenBalance] =
    useState<CurrencyValue>({
      balance: '0.00',
      symbol: '',
      symbolType: 'text',
    })
  const [selectedTokenBalanceUsd, setSelectedTokenBalanceUsd] =
    useState<CurrencyValue>({
      balance: '0.00',
      symbol: '',
      symbolType: 'text',
    })
  const [showInfoBar, setShowInfoBar] = useState<boolean>(true)

  const balances: Array<ITokenWithBalance | BitcoinNetwork> = useMemo(() => {
    if (bitcoinCore) {
      return [
        ...Object.values(tokenBalances),
        ...Object.values(bitcoinCore.networksMap),
      ]
    } else {
      return []
    }
  }, [tokenBalances, bitcoinCore])

  const totalUsdBalance = useMemo(
    () =>
      balances
        .reduce((previousValue, token) => {
          if ('satoshis' in token) {
            previousValue += token.balance * (prices.BTC?.price || 0)
          } else {
            previousValue += convertBalance(
              token.balance,
              token.decimals,
              prices[token.contractAddress]?.price || 0,
            )
          }
          return previousValue
        }, 0)
        .toFixed(2),
    [balances, prices],
  )

  // token or undefined
  const selected: ITokenWithoutLogo | BitcoinNetwork | undefined =
    selectedAddress && bitcoinCore
      ? tokenBalances[selectedAddress] ||
        bitcoinCore.networksMap[selectedAddress]
      : undefined
  const selectedColor = getTokenColor(selected?.symbol || '')
  const backgroundColor = {
    backgroundColor: selectedAddress ? selectedColor : sharedColors.borderColor,
  }

  const ramp = useMemo(
    () =>
      new RampSdk({
        // for testnet:
        url: 'https://app.demo.ramp.network',

        // for IOV:
        swapAsset: 'RSK_RDOC',
        // userAddress must be lowercase or checksummed correctly:
        userAddress: wallet
          ? toChecksumAddress(
              wallet.smartWalletAddress,
              getChainIdByType(chainType),
            )
          : '',

        // for the dapp:
        hostAppName: 'RIF Wallet',
        hostLogoUrl: 'https://rampnetwork.github.io/assets/misc/test-logo.png',
      }),
    [wallet, chainType],
  )

  const addBalance = useCallback(() => {
    ramp.on('*', console.log)
    ramp.show()
  }, [ramp])

  const handleBitcoinSendReceive = useCallback(
    (
      screen: 'SEND' | 'RECEIVE' | 'FAUCET',
      _selected: ITokenWithoutLogo & BitcoinNetwork,
    ) => {
      switch (screen) {
        case 'RECEIVE':
          return navigation.navigate(homeStackRouteNames.Receive, {
            networkId: _selected.networkId,
          })
        case 'SEND':
          return navigation.navigate(homeStackRouteNames.Send, {
            token: _selected?.symbol,
            contractAddress: _selected?.contractAddress,
          })
      }
    },
    [navigation],
  )

  // interact with the navigation
  const handleSendReceive = useCallback(
    (screen: 'SEND' | 'RECEIVE' | 'FAUCET') => {
      if (selected instanceof BitcoinNetwork) {
        return handleBitcoinSendReceive(screen, selected)
      }
      switch (screen) {
        case 'SEND':
          return navigation.navigate(homeStackRouteNames.Send, {
            backAction: navigation.goBack,
            token: selected?.symbol,
            contractAddress: selected?.contractAddress,
          })
        case 'RECEIVE':
          return navigation.navigate(homeStackRouteNames.Receive, {
            token: selected,
          })
        case 'FAUCET':
          return addBalance()
      }
    },
    [handleBitcoinSendReceive, navigation, selected, addBalance],
  )

  useEffect(() => {
    if (isFocused) {
      dispatch(changeTopColor(selectedColor))
    }
  }, [selectedColor, dispatch, isFocused])

  const selectedToken = useMemo(() => {
    if (selected instanceof BitcoinNetwork) {
      return {
        ...selected,
        price: prices?.BTC?.price || 0,
      }
    }
    if (selected) {
      return {
        ...selected,
        price: prices?.[selected.contractAddress]?.price || 0,
      }
    }
    return {
      name: '',
      decimals: 0,
      symbol: '',
      price: 0,
      contractAddress: '',
      balance: '0',
    }
  }, [selected, prices])

  useEffect(() => {
    const { symbol, balance, decimals, price } = selectedToken
    setSelectedTokenBalance({
      symbolType: 'icon',
      symbol,
      balance:
        selected instanceof BitcoinNetwork
          ? balance
          : balanceToDisplay(balance, decimals, 5),
    })
    setSelectedTokenBalanceUsd({
      symbolType: 'text',
      symbol: '$',
      balance:
        selected instanceof BitcoinNetwork
          ? '' +
            convertBalance(
              BigNumber.from(Math.round(Number(balance) * 10e8)),
              8,
              price,
            )
          : '' + convertBalance(balance, decimals, price),
    })
  }, [
    selected,
    selectedToken,
    selectedToken.balance,
    selectedToken.decimals,
    selectedToken.price,
  ])
  const closed = useMemo(() => {
    if (hasIsGettingStartedClosed()) {
      const { close } = getIsGettingStartedClosed()
      return close
    }
    return false
  }, [])

  const onClose = useCallback(() => {
    saveIsGettingStartedClosed({ close: true })
    setShowInfoBar(false)
  }, [])

  const { transactions } = useAppSelector(selectTransactions)

  const btcTransactionFetcher = useBitcoinTransactionsHandler({
    bip:
      bitcoinCore && bitcoinCore.networks[0]
        ? bitcoinCore.networks[0].bips[0]
        : ({} as BIP),
    shouldMergeTransactions: true,
  })

  const transactionsCombined = useTransactionsCombiner(
    transactions,
    btcTransactionFetcher.transactions,
  )

  // this code is copied from the activity screen
  // On load, fetch both BTC and WALLET transactions
  useEffect(() => {
    // TODO: rethink btcTransactionFetcher, when adding as dependency
    // the function gets executed a million times
    btcTransactionFetcher.fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const overrideFirstValue: CurrencyValue = {
    balance: '$' + totalUsdBalance.toString(),
    symbol: '',
    symbolType: 'text',
  }
  return (
    <ScrollView style={styles.container}>
      <TokenBalance
        style={styles.tokenBalance}
        firstValue={
          selectedAddress === undefined
            ? overrideFirstValue
            : selectedTokenBalance
        }
        secondValue={
          selectedAddress === undefined ? undefined : selectedTokenBalanceUsd
        }
        hideable={true}
        hide={hideBalance}
        onHide={() => dispatch(setHideBalance(!hideBalance))}
        color={backgroundColor.backgroundColor}
      />
      <HomeBarButtonGroup
        onPress={handleSendReceive}
        isSendDisabled={balances.length === 0}
        color={backgroundColor.backgroundColor}
      />

      {showInfoBar && !closed && <HomeInformationBar onClose={onClose} />}

      <View style={styles.bodyContainer}>
        <Typography style={styles.portfolioLabel} type={'h3'}>
          {t('home_screen_portfolio')}
        </Typography>
        <PortfolioComponent
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          balances={balances}
          prices={prices}
        />

        <Typography style={styles.transactionsLabel} type={'h3'}>
          {t('home_screen_transactions')}
        </Typography>
        {transactionsCombined.length > 1 ? (
          <ScrollView>
            {transactionsCombined.map((tx, index) => (
              <View style={styles.transactionItem} key={index}>
                <ActivityBasicRow
                  key={tx.id}
                  activityTransaction={tx}
                  navigation={navigation}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <>
            <Typography style={styles.emptyTransactionsLabel} type={'h3'}>
              {t('home_screen_empty_transactions')}
            </Typography>
            <Typography style={styles.emptyTransactionsLabel} type={'h4'}>
              {t('home_screen_no_transactions_created')}
            </Typography>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bodyContainer: castStyle.view({
    padding: 12,
  }),
  tokenBalance: castStyle.view({
    paddingLeft: 24,
    paddingRight: 18,
  }),
  emptyTransactionsLabel: castStyle.text({
    padding: 6,
    paddingTop: 10,
  }),
  portfolioLabel: castStyle.text({
    padding: 6,
    paddingTop: 10,
    color: sharedColors.inputLabelColor,
  }),
  transactionItem: castStyle.view({
    paddingHorizontal: 6,
  }),
  transactionsLabel: castStyle.text({
    padding: 6,
    color: sharedColors.inputLabelColor,
  }),
  container: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.secondary,
  }),
  text: castStyle.text({
    textAlign: 'center',
    color: colors.lightPurple,
  }),
  noBalance: castStyle.image({
    width: '100%',
    resizeMode: 'contain',
  }),
})
