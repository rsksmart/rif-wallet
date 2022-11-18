import React, { useState } from 'react'
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native'
import ActivityRow from './ActivityRow'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { useTranslation } from 'react-i18next'
import { useBitcoinCoreContext } from '../../Context'
import useBitcoinTransactionsHandler from './useBitcoinTransactionsHandler'
import useTransactionsCombiner from './useTransactionsCombiner'
import { IApiTransaction } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import {
  IAbiEnhancer,
  IEnhancedResult,
} from '../../lib/abiEnhancer/AbiEnhancer'
import { RIFWallet } from '../../lib/core'
import { ScreenWithWallet } from '../types'
import { RootStackScreenProps } from '../../navigation/rootNavigator/types'
import { TransactionsServerResponseWithActivityTransactions } from './types'
import { colors } from '../../styles'

export type ActivityScreenProps = {
  fetcher: IRIFWalletServicesFetcher
  abiEnhancer: IAbiEnhancer
}

export const ActivityScreen: React.FC<
  RootStackScreenProps<'Activity'> & ScreenWithWallet & ActivityScreenProps
> = ({ wallet, fetcher, abiEnhancer, navigation }) => {
  const [info, setInfo] = useState('')
  const { networks } = useBitcoinCoreContext()
  const btcTransactionFetcher = useBitcoinTransactionsHandler({
    bip: networks[0].bips[0],
    shouldMergeTransactions: true,
  })
  const {
    state: { transactions },
    dispatch,
  } = useSocketsState()
  const { t } = useTranslation()

  const transactionsCombined = useTransactionsCombiner(
    transactions.activityTransactions,
    btcTransactionFetcher.transactions,
  )
  const hasTransactions = transactionsCombined.length > 0

  // On load, fetch btc transactions
  React.useEffect(() => {
    btcTransactionFetcher.fetchTransactions()
  }, [])

  const fetchTransactionsPage = async ({
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
        await fetcher.fetchTransactionsByAddress(
          wallet.smartWalletAddress.toLowerCase(),
          prev,
          next,
        )

      fetchedTransactions.activityTransactions = await Promise.all(
        fetchedTransactions.data.map(async (tx: IApiTransaction) => {
          const enhancedTransaction = await enhanceTransactionInput(
            tx,
            wallet,
            abiEnhancer,
          )
          return {
            originTransaction: tx,
            enhancedTransaction,
            id: tx.hash,
          }
        }),
      )

      dispatch({
        type: 'newTransactions',
        payload: fetchedTransactions,
      })

      setInfo('')
    } catch (e) {
      setInfo(t('Error reaching API: ') + e.message)
    }
  }

  const onRefresh = () => {
    fetchTransactionsPage()
    btcTransactionFetcher.fetchTransactions(undefined, 1)
  }
  return (
    <View style={styles.mainContainer}>
      {hasTransactions && (
        <FlatList
          data={transactionsCombined}
          initialNumToRender={10}
          keyExtractor={item => item.id}
          onEndReached={() => {
            fetchTransactionsPage({ next: transactions?.next })
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
      )}
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
  abiEnhancer: IAbiEnhancer,
): Promise<IEnhancedResult | undefined> => {
  let tx
  try {
    tx = wallet.smartWallet.smartWalletContract.interface.decodeFunctionData(
      'directExecute',
      transaction.input,
    )
    return (await abiEnhancer.enhance(wallet, {
      from: wallet.smartWalletAddress,
      to: tx.to.toLowerCase(),
      data: tx.data,
      value: transaction.value,
    }))!
  } catch {
    return undefined
  }
}
