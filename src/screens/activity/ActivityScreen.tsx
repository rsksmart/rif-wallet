import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { useTranslation } from 'react-i18next'
import { useSocketsState } from '../../ux/RIFSocketsContext/RIFSocketsContext'
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
import { grid } from '../../styles/grid'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow, RefreshIcon } from '../../components/icons'

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
  const { state, dispatch } = useSocketsState()
  const [info, setInfo] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    fetchTransactionsPage()
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
      dispatch({ type: 'newActivity', payload: null })

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

      dispatch({ type: 'newActivity', payload: fetchedTransactions })
      setInfo('')
    } catch (e: any) {
      setInfo(t('Error reaching API: ') + e.message)
    }
  }

  return (
    <ScrollView style={styles.parent}>
      <Text style={styles.header}>Activity</Text>
      <View style={{ ...grid.row, ...styles.refreshButtonView }}>
        <View style={{ ...grid.column4, ...styles.column }}>
          <SquareButton
            onPress={() =>
              fetchTransactionsPage({ prev: state.activities?.prev })
            }
            disabled={!state.activities?.prev}
            title="prev"
            icon={
              <Arrow
                rotate={270}
                color={state.activities?.prev ? '#66777E' : '#f1f1f1'}
              />
            }
          />
        </View>
        <View style={{ ...grid.column4, ...styles.column }}>
          <SquareButton
            onPress={() => fetchTransactionsPage()}
            title="refresh"
            icon={<RefreshIcon width={50} height={50} color="#66777E" />}
          />
        </View>
        <View style={{ ...grid.column4, ...styles.column }}>
          <SquareButton
            onPress={() =>
              fetchTransactionsPage({ next: state.activities?.next })
            }
            disabled={!state.activities?.next}
            title="next"
            icon={
              <Arrow
                rotate={90}
                color={state.activities?.next ? '#66777E' : '#f1f1f1'}
              />
            }
          />
        </View>
      </View>

      {!!info && <Text testID="Info.Text">{info}</Text>}

      {state.activities &&
        state.activities.activityTransactions!.length > 0 &&
        state.activities.activityTransactions!.map(
          (activityTransaction: IActivityTransaction) => (
            <ActivityRow
              key={activityTransaction.originTransaction.hash}
              activityTransaction={activityTransaction}
              navigation={navigation}
            />
          ),
        )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 20,
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

const enhanceTransactionInput = async (
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
