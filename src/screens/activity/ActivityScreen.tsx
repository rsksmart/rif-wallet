import React, { useState } from 'react'
import { FlatList, StyleSheet, View, Text } from 'react-native'

import { useSocketsState } from '../../subscriptions/RIFSockets'
import { useTranslation } from 'react-i18next'
import {
  IApiTransaction,
  TransactionsServerResponse,
} from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'

import {
  IAbiEnhancer,
  IEnhancedResult,
} from '../../lib/abiEnhancer/AbiEnhancer'
import { ScreenWithWallet } from '../types'
import { ScreenProps } from '../../RootNavigation'
import { RIFWallet } from '../../lib/core'
import ActivityRow from './ActivityRow'
import { IActivity } from '../../subscriptions/types'

export interface IActivityTransaction {
  originTransaction: IApiTransaction
  enhancedTransaction?: IEnhancedResult
}

export type ActivityScreenProps = {
  fetcher: IRIFWalletServicesFetcher
  abiEnhancer: IAbiEnhancer
}

interface TransactionsServerResponseWithActivityTransactions
  extends TransactionsServerResponse {
  activityTransactions?: IActivityTransaction[]
}

export const ActivityScreen: React.FC<
  ScreenProps<'Activity'> & ScreenWithWallet & ActivityScreenProps
> = ({ wallet, fetcher, abiEnhancer, navigation }) => {
  const [info, setInfo] = useState('')
  const {
    state: { transactions },
    dispatch,
  } = useSocketsState()
  useState<TransactionsServerResponseWithActivityTransactions | null>(null)
  const { t } = useTranslation()

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
          }
        }),
      )

      dispatch({
        type: 'newTransactions',
        payload: fetchedTransactions as IActivity,
      })

      setInfo('')
    } catch (e: any) {
      setInfo(t('Error reaching API: ') + e.message)
    }
  }

  return (
    <View>
      <Text style={styles.header}>Activity</Text>

      {transactions &&
        transactions.activityTransactions!.length > 0 &&
        <FlatList
          data={transactions.activityTransactions}
          initialNumToRender={10}
          keyExtractor={item => item.originTransaction.hash}
          onEndReached={() => fetchTransactionsPage({ next: transactions?.next })}
          onEndReachedThreshold={0.2}
          onRefresh={fetchTransactionsPage}
          refreshing={!!info}
          renderItem={({ item }) => <ActivityRow activityTransaction={item} navigation={navigation} />}
          style={styles.parent}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#ffffff',
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
