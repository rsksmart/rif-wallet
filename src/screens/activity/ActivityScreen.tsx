import { useState, useEffect, useCallback } from 'react'
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native'
import { useTranslation } from 'react-i18next'

import { IApiTransaction } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import { RIFWallet } from 'lib/core'
import BIP from 'lib/bitcoin/BIP'
import { IEnhancedResult } from 'lib/abiEnhancer/AbiEnhancer'

import ActivityRow from './ActivityRow'
import useBitcoinTransactionsHandler from './useBitcoinTransactionsHandler'
import useTransactionsCombiner from './useTransactionsCombiner'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { abiEnhancer, rifWalletServicesFetcher } from 'core/setup'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { addNewTransactions } from 'store/slices/transactionsSlice/transactionsSlice'
import { selectTransactions } from 'store/slices/transactionsSlice/selectors'
import { colors } from 'src/styles'
import { ScreenWithWallet } from '../types'
import { TransactionsServerResponseWithActivityTransactions } from './types'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'

export const ActivityScreen = ({
  wallet,
  navigation,
}: RootStackScreenProps<rootStackRouteNames.Activity> & ScreenWithWallet) => {
  const [info, setInfo] = useState('')
  const bitcoinCore = useBitcoinContext()
  const btcTransactionFetcher = useBitcoinTransactionsHandler({
    bip:
      bitcoinCore && bitcoinCore.networks[0]
        ? bitcoinCore.networks[0].bips[0]
        : ({} as BIP),
    shouldMergeTransactions: true,
  })

  const { transactions, next: nextCurrent } = useAppSelector(selectTransactions)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const transactionsCombined = useTransactionsCombiner(
    transactions,
    btcTransactionFetcher.transactions,
  )

  // On load, fetch btc transactions
  useEffect(() => {
    btcTransactionFetcher.fetchTransactions()
  }, [btcTransactionFetcher])

  const fetchTransactionsPage = useCallback(
    async ({
      prev,
      next,
    }: {
      prev?: string | null
      next?: string | null
    } = {}) => {
      /*i18n.changeLanguage('es')*/
      try {
        setInfo(t('Loading transactions. Please wait...'))

        const fetchedTransactions: TransactionsServerResponseWithActivityTransactions =
          await rifWalletServicesFetcher.fetchTransactionsByAddress(
            wallet.smartWalletAddress.toLowerCase(),
            prev,
            next,
          )

        fetchedTransactions.activityTransactions = await Promise.all(
          fetchedTransactions.data.map(async (tx: IApiTransaction) => {
            const enhancedTransaction = await enhanceTransactionInput(
              tx,
              wallet,
            )
            return {
              originTransaction: tx,
              enhancedTransaction,
              id: tx.hash,
            }
          }),
        )
        dispatch(addNewTransactions(fetchedTransactions))

        setInfo('')
      } catch (e) {
        if (e instanceof Error) {
          setInfo(t('Error reaching API: ') + e.message)
        }
      }
    },
    [dispatch, t, wallet],
  )

  // On load, fetch both BTC and WALLET transactions
  useEffect(() => {
    btcTransactionFetcher.fetchTransactions()
    fetchTransactionsPage()
  }, [btcTransactionFetcher, fetchTransactionsPage])

  const onRefresh = () => {
    fetchTransactionsPage()
    btcTransactionFetcher.fetchTransactions(undefined, 1)
  }
  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={transactionsCombined}
        initialNumToRender={10}
        keyExtractor={item => item.id}
        onEndReached={() => {
          fetchTransactionsPage({ next: nextCurrent })
          btcTransactionFetcher.fetchNextTransactionPage()
        }}
        onEndReachedThreshold={0.2}
        refreshing={!!info}
        renderItem={({ item }) => (
          <ActivityRow activityTransaction={item} navigation={navigation} />
        )}
        style={styles.parent}
        refreshControl={
          <RefreshControl
            refreshing={!!info}
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
): Promise<IEnhancedResult | null> => {
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
