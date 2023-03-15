import { useEffect, useCallback } from 'react'
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native'
import { BIP } from '@rsksmart/rif-wallet-bitcoin'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'
import { IApiTransaction } from '@rsksmart/rif-wallet-services'
import { useTranslation } from 'react-i18next'

import { abiEnhancer } from 'core/setup'
import { useAppSelector } from 'store/storeUtils'
import { selectTransactions } from 'store/slices/transactionsSlice/selectors'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import { sharedColors } from 'shared/constants'
import { Typography } from 'src/components'
import { castStyle } from 'shared/utils'
import { ActivityMainScreenProps } from 'shared/types'

import { ActivityBasicRow } from './ActivityRow'
import { useBitcoinTransactionsHandler } from './useBitcoinTransactionsHandler'
import useTransactionsCombiner from './useTransactionsCombiner'
import { ScreenWithWallet } from '../types'

export const ActivityScreen = ({
  navigation,
}: {
  navigation: ActivityMainScreenProps['navigation']
} & ScreenWithWallet) => {
  const { t } = useTranslation()
  const bitcoinCore = useBitcoinContext()
  const btcTransactionFetcher = useBitcoinTransactionsHandler({
    bip:
      bitcoinCore && bitcoinCore.networks[0]
        ? bitcoinCore.networks[0].bips[0]
        : ({} as BIP),
    shouldMergeTransactions: true,
  })

  const { transactions } = useAppSelector(selectTransactions)
  const transactionsCombined = useTransactionsCombiner(
    transactions,
    btcTransactionFetcher.transactions,
  )

  // On load, fetch both BTC and WALLET transactions
  useEffect(() => {
    // TODO: rethink btcTransactionFetcher, when adding as dependency
    // the function gets executed a million times
    btcTransactionFetcher.fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onRefresh = useCallback(() => {
    btcTransactionFetcher.fetchTransactions(undefined, 1)
  }, [btcTransactionFetcher])

  return (
    <View style={styles.mainContainer}>
      <Typography type="h2" style={styles.transactionsTextStyle}>
        {t('home_screen_transactions')}
      </Typography>
      <FlatList
        data={transactionsCombined}
        initialNumToRender={10}
        keyExtractor={item => item.id}
        onEndReached={() => {
          btcTransactionFetcher.fetchNextTransactionPage()
        }}
        onEndReachedThreshold={0.2}
        refreshing={btcTransactionFetcher.apiStatus === 'fetching'}
        renderItem={({ item }) => (
          <ActivityBasicRow
            activityTransaction={item}
            navigation={navigation}
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
    paddingHorizontal: 15,
    minHeight: '100%',
  }),
  refreshButtonView: castStyle.view({
    paddingVertical: 15,
    alignContent: 'center',
    borderBottomColor: '#CCCCCC',
  }),
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
  transactionsTextStyle: castStyle.text({
    marginTop: 40,
    marginBottom: 20,
    paddingLeft: 15,
  }),
})

export const enhanceTransactionInput = async (
  transaction: IApiTransaction,
  wallet: RIFWallet,
): Promise<EnhancedResult | null> => {
  let tx
  try {
    tx = wallet.smartWallet.smartWalletContract.interface.decodeFunctionData(
      'directExecute',
      transaction.input,
    )
    return await abiEnhancer.enhance(wallet, {
      from: wallet.smartWalletAddress,
      to: tx.to.toLowerCase(),
      data: tx.data,
      value: transaction.value,
    })
  } catch {
    return null
  }
}
