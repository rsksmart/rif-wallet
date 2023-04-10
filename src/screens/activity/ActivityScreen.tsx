import { useEffect, useCallback, useState } from 'react'
import { FlatList, StyleSheet, View, RefreshControl, Image } from 'react-native'
import { BIP } from '@rsksmart/rif-wallet-bitcoin'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'
import { IApiTransaction } from '@rsksmart/rif-wallet-services'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'

import { abiEnhancer } from 'core/setup'
import { useAppSelector } from 'store/storeUtils'
import { selectTransactions } from 'store/slices/transactionsSlice/selectors'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import { sharedColors } from 'shared/constants'
import { Typography } from 'components/typography'
import { castStyle } from 'shared/utils'
import { ActivityMainScreenProps } from 'shared/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { selectSelectedWallet, selectWallets } from 'store/slices/settingsSlice'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'

import { ActivityBasicRow } from './ActivityRow'
import { useBitcoinTransactionsHandler } from './useBitcoinTransactionsHandler'
import { combineTransactions } from './combineTransactions'
import { ScreenWithWallet } from '../types'
import { ActivityRowPresentationObjectType } from './types'
import { activityDeserializer } from './activityDeserializer'

export const ActivityScreen = ({
  navigation,
}: ActivityMainScreenProps & ScreenWithWallet) => {
  const wallets = useAppSelector(selectWallets)
  const selectedWallet = useAppSelector(selectSelectedWallet)
  const prices = useAppSelector(selectUsdPrices)
  const { t } = useTranslation()
  const bitcoinCore = useBitcoinContext()
  const btcTransactionFetcher = useBitcoinTransactionsHandler({
    bip:
      bitcoinCore && bitcoinCore.networks[0]
        ? bitcoinCore.networks[0].bips[0]
        : ({} as BIP),
    shouldMergeTransactions: true,
  })
  const [deserializedTransactions, setDeserializedTransactions] = useState<
    ActivityRowPresentationObjectType[]
  >([])

  const { transactions } = useAppSelector(selectTransactions)

  // On load, fetch both BTC and WALLET transactions
  useEffect(() => {
    // TODO: rethink btcTransactionFetcher, when adding as dependency
    // the function gets executed a million times
    btcTransactionFetcher.fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      transactions &&
      btcTransactionFetcher.transactions &&
      wallets &&
      selectedWallet &&
      prices
    ) {
      const transactionsCombined = combineTransactions(
        transactions,
        btcTransactionFetcher.transactions,
      )
      setDeserializedTransactions(
        transactionsCombined.map(tx =>
          activityDeserializer(tx, prices, wallets[selectedWallet]),
        ),
      )
    }
  }, [
    transactions,
    btcTransactionFetcher.transactions,
    wallets,
    selectedWallet,
    prices,
  ])

  const onRefresh = useCallback(() => {
    btcTransactionFetcher.fetchTransactions(undefined, 1)
  }, [btcTransactionFetcher])

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={deserializedTransactions}
        initialNumToRender={10}
        keyExtractor={item => item.id}
        onEndReached={() => {
          btcTransactionFetcher.fetchNextTransactionPage()
        }}
        onEndReachedThreshold={0.2}
        refreshing={btcTransactionFetcher.apiStatus === 'fetching'}
        renderItem={({ item }) => (
          <ActivityBasicRow
            activityDetails={item}
            navigation={navigation}
            backScreen={rootTabsRouteNames.Activity}
          />
        )}
        style={styles.flatlistViewStyle}
        refreshControl={
          <RefreshControl
            refreshing={btcTransactionFetcher.apiStatus === 'fetching'}
            tintColor="white"
            onRefresh={onRefresh}
          />
        }
        ListHeaderComponent={
          <View style={styles.transactionsViewStyle}>
            <Typography type="h2">{t('home_screen_transactions')}</Typography>
            {deserializedTransactions.length === 0 &&
              btcTransactionFetcher.apiStatus !== 'fetching' && (
                <Typography type="h4" style={styles.listEmptyTextStyle}>
                  {t('activity_list_empty')}
                </Typography>
              )}
          </View>
        }
        ListEmptyComponent={
          <>
            {btcTransactionFetcher.apiStatus !== 'fetching' && (
              <Image
                source={require('/assets/images/no-transactions.png')}
                resizeMode="contain"
                style={styles.imageStyle}
              />
            )}
          </>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: castStyle.view({
    backgroundColor: sharedColors.secondary,
    minHeight: '100%',
    marginBottom: 200,
    position: 'relative',
  }),
  flatlistViewStyle: castStyle.view({
    paddingBottom: 30,
    marginBottom: 300,
    paddingHorizontal: 15,
    minHeight: '100%',
  }),
  refreshButtonView: castStyle.view({
    paddingVertical: 15,
    alignContent: 'center',
    borderBottomColor: '#CCCCCC',
  }),
  transactionsViewStyle: castStyle.view({
    marginTop: 40,
    marginBottom: 20,
    paddingLeft: 15,
  }),
  listEmptyTextStyle: castStyle.text({
    marginTop: 10,
  }),
  imageStyle: castStyle.image({
    alignSelf: 'center',
    width: '80%',
    height: 500,
  }),
})

export const enhanceTransactionInput = async (
  transaction: IApiTransaction,
  wallet: RIFWallet,
): Promise<EnhancedResult | null> => {
  try {
    const enhancedTx = await abiEnhancer.enhance(wallet, {
      from: transaction.from.toLowerCase(),
      to: transaction.to.toLowerCase(),
      data: ethers.utils.arrayify(transaction.input),
      value: transaction.value,
    })
    return enhancedTx
  } catch (e) {
    return null
  }
}
