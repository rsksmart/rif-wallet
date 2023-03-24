import { useEffect, useCallback } from 'react'
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native'
import { BIP } from '@rsksmart/rif-wallet-bitcoin'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'

import { IApiTransaction } from '@rsksmart/rif-wallet-services'
import { abiEnhancer } from 'core/setup'
import { useAppSelector } from 'store/storeUtils'
import { selectTransactions } from 'store/slices/transactionsSlice/selectors'
import { colors } from 'src/styles'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'

import { ActivityRow } from './ActivityRow'
import { useBitcoinTransactionsHandler } from './useBitcoinTransactionsHandler'
import useTransactionsCombiner from './useTransactionsCombiner'
import { ScreenWithWallet } from '../types'

export const ActivityScreen = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Activity> & ScreenWithWallet) => {
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
  console.log(transaction.internalTransactions)
  const itxs = transaction.internalTransactions
  let tx
  try {
    console.log('SigHash', wallet.smartWallet.smartWalletContract.interface.getSighash('execute'))
    console.log('SigHash', wallet.smartWallet.smartWalletContract.interface.getSighash('directExecute'))
    itxs.forEach(itx => {
      try{
        // const data = wallet.smartWallet.smartWalletContract.interface.decodeFunctionData(
        //   'execute',
        //   itx.action.input,
        // )
        const data = wallet.smartWallet.smartWalletContract.interface.parseTransaction({data: itx.action.input})
        console.log('Data from itx', data);
      } catch(er) {
        console.log(er)
      }
    })
    tx = wallet.smartWallet.smartWalletContract.interface.decodeFunctionData(
      'execute',
      itxs[0].action.input,
    )
    const enhancedTx = await abiEnhancer.enhance(wallet, {
      from: transaction.from.toLowerCase(),
      to: transaction.to.toLowerCase(),
      data: tx.data,
      value: transaction.value,
    })
    console.log(enhancedTx)
    return enhancedTx
  } catch(e) {
    console.log('Error Tx', e)
    return null
  }
}
