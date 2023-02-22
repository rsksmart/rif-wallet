import { BigNumber } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, StyleSheet, View, ScrollView } from 'react-native'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'
import { BIP } from '@rsksmart/rif-wallet-bitcoin'
import { useTranslation } from 'react-i18next'

import { balanceToDisplay, convertBalance, getChainIdByType } from 'lib/utils'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'

import { toChecksumAddress } from 'components/address/lib'
import { MediumText, Typography } from 'components/index'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { colors } from 'src/styles'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import { changeTopColor, selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { HomeBarButtonGroup } from 'screens/home/HomeBarButtonGroup'

import PortfolioComponent from './PortfolioComponent'
import { CurrencyValue, TokenBalance } from 'components/token'
import { getTokenColor } from './tokenColor'
import { selectTransactions } from 'store/slices/transactionsSlice'
import { sharedColors } from 'shared/constants'
import { useBitcoinTransactionsHandler } from 'screens/activity/useBitcoinTransactionsHandler'
import useTransactionsCombiner from 'screens/activity/useTransactionsCombiner'
import { ActivityBasicRow } from 'screens/activity/ActivityRow'
import { castStyle } from 'shared/utils'

export const HomeScreen = ({
  navigation,
}: HomeStackScreenProps<homeStackRouteNames.Main>) => {
  const dispatch = useAppDispatch()
  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)
  const bitcoinCore = useBitcoinContext()
  const { wallet, chainType } = useAppSelector(selectActiveWallet)
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined,
  )
  const [firstValue, setFirstValue] = useState<CurrencyValue>({
    balance: '0.00',
    symbol: '',
    symbolType: 'text',
  })
  const [secondValue, setSecondValue] = useState<CurrencyValue>({
    balance: '0.00',
    symbol: '',
    symbolType: 'text',
  })

  const [hide, setHide] = useState<boolean>(false)
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

  // token or undefined
  const selected: ITokenWithoutLogo | BitcoinNetwork | undefined =
    selectedAddress && bitcoinCore
      ? tokenBalances[selectedAddress] ||
        bitcoinCore.networksMap[selectedAddress]
      : undefined
  const selectedColor = getTokenColor(selected ? selected.symbol : undefined)
  const backGroundColor = {
    backgroundColor: selectedAddress ? selectedColor : getTokenColor('DEFAULT'),
  }

  useEffect(() => {
    if (!selected) {
      balances.length !== 0
        ? setSelectedAddress(balances[0].contractAddress)
        : undefined
    }
  }, [balances, selected])

  const handleBitcoinSendReceive = useCallback(
    (
      screen: 'SEND' | 'RECEIVE' | 'FAUCET',
      _selected: ITokenWithoutLogo & BitcoinNetwork,
    ) => {
      switch (screen) {
        case 'RECEIVE':
          return navigation.navigate(homeStackRouteNames.ReceiveBitcoin, {
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
            token: selected?.symbol,
            contractAddress: selected?.contractAddress,
          })
        case 'RECEIVE':
          return navigation.navigate(homeStackRouteNames.Receive)
        case 'FAUCET':
          const address = wallet?.smartWallet.smartWalletContract.address
          address &&
            addBalance(toChecksumAddress(address, getChainIdByType(chainType)))
          return
      }
    },
    [chainType, handleBitcoinSendReceive, navigation, selected, wallet],
  )

  const addBalance = (address: string) => {
    console.log('temporarly removed', address)
  }

  useEffect(() => {
    dispatch(changeTopColor(selectedColor))
  }, [selectedColor, dispatch])

  const selectedToken = useMemo(() => {
    if (selected instanceof BitcoinNetwork) {
      return {
        ...selected,
        ...{ price: prices ? prices.BTC?.price : 0 },
      }
    }
    if (selected) {
      return {
        ...selected,
        ...{ price: prices ? prices[selected.contractAddress]?.price : 0 },
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
    setFirstValue({
      symbolType: 'icon',
      symbol,
      balance:
        selected instanceof BitcoinNetwork
          ? balance
          : balanceToDisplay(balance, decimals, 5),
    })
    setSecondValue({
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

  const onHide = useCallback(() => {
    setHide(!hide)
  }, [hide])
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
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={{ ...styles.topColor, ...backGroundColor }} />
      <View style={styles.bottomColor} />
      <View style={styles.parent}>
        <TokenBalance
          firstValue={firstValue}
          secondValue={secondValue}
          hideable={true}
          hide={hide}
          onHide={onHide}
          color={backGroundColor.backgroundColor}
        />
        <HomeBarButtonGroup
          onPress={handleSendReceive}
          isSendDisabled={balances.length === 0}
          color={backGroundColor.backgroundColor}
        />
        <Typography style={styles.portfolioLabel} type={'h3'}>
          {t('home_screen_portfolio')}
        </Typography>

        {balances.length === 0 ? (
          <>
            <Image
              source={require('src/images/noBalance.png')}
              style={styles.noBalance}
            />
            <MediumText style={styles.text}>
              You don't have any balances, get some here!
            </MediumText>
          </>
        ) : (
          <PortfolioComponent
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            balances={balances}
            prices={prices}
          />
        )}
        <Typography style={styles.transactionsLabel} type={'h3'}>
          {t('home_screen_transactions')}
        </Typography>
        <ScrollView>
          {transactionsCombined.map(tx => (
            <ActivityBasicRow activityTransaction={tx} />
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  portfolioLabel: castStyle.text({
    padding: 6,
    paddingTop: 10,
    color: sharedColors.inputLabelColor,
  }),
  transactionsLabel: castStyle.text({
    padding: 6,
    color: sharedColors.inputLabelColor,
  }),
  container: castStyle.view({
    flexDirection: 'column',
    backgroundColor: sharedColors.secondary,
  }),

  parent: castStyle.view({
    width: '100%',
    height: '100%',
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
