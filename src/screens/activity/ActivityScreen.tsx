import { useEffect } from 'react'
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native'

import { IApiTransaction } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import { RIFWallet } from 'lib/core'
import BIP from 'lib/bitcoin/BIP'
import { EnhancedResult } from 'lib/abiEnhancer/AbiEnhancer'
import { abiEnhancer } from 'core/setup'
import { useAppSelector } from 'store/storeUtils'
import { selectTransactions } from 'store/slices/transactionsSlice/selectors'
import { colors } from 'src/styles'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'

import ActivityRow from './ActivityRow'
import { useBitcoinTransactionsHandler } from './useBitcoinTransactionsHandler'
import useTransactionsCombiner from './useTransactionsCombiner'
import { ScreenWithWallet } from '../types'

export const ActivityScreen = ({
  navigation,
}: RootStackScreenProps<rootStackRouteNames.Activity> & ScreenWithWallet) => {
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
  // On load, fetch btc transactions
  useEffect(() => {
    btcTransactionFetcher.fetchTransactions()
  }, [])

  // On load, fetch both BTC and WALLET transactions
  useEffect(() => {
    btcTransactionFetcher.fetchTransactions()
  }, [])

  const onRefresh = () => {
    btcTransactionFetcher.fetchTransactions(undefined, 1)
  }
  return (
    <View style={styles.mainContainer}>
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
          <ActivityRow activityTransaction={item} navigation={navigation} />
        )}
        style={styles.parent}
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
  mainContainer: {
    backgroundColor: colors.background.darkBlue,
    minHeight: '100%',
    marginBottom: 200,
    position: 'relative',
  },
  parent: {
    paddingBottom: 30,
    paddingHorizontal: 15,
    backgroundColor: colors.background.darkBlue,
    minHeight: '100%',
  },
  refreshButtonView: {
    paddingVertical: 15,
    alignContent: 'center',
    borderBottomColor: '#CCCCCC',
  },
  column: {
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
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
