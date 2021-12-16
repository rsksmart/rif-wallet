import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { useTranslation } from 'react-i18next'
import { Button } from '../../components'
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
import { Arrow } from '../../components/icons'

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
  const [transactions, setTransactions] =
    useState<TransactionsServerResponseWithActivityTransactions | null>(null)
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

      setTransactions(fetchedTransactions)
      setInfo('')
    } catch (e: any) {
      setInfo(t('Error reaching API: ') + e.message)
    }
  }

  return (
    <ScrollView style={styles.parent}>
      <View style={{ ...grid.row, ...styles.refreshButtonView }}>
        <View style={{ ...grid.column4, ...styles.column }}>
          <SquareButton
            onPress={() => fetchTransactionsPage({ prev: transactions?.prev })}
            disabled={!transactions?.prev}
            title="prev"
            icon={
              <Arrow
                rotate={270}
                color={transactions?.prev ? '#000000' : '#e1e1e1'}
              />
            }
          />
        </View>
        <View style={{ ...grid.column4, ...styles.column }}>
          <SquareButton
            onPress={() => fetchTransactionsPage()}
            title="refresh"
          />
        </View>
        <View style={{ ...grid.column4, ...styles.column }}>
          <SquareButton
            onPress={() => fetchTransactionsPage({ next: transactions?.next })}
            disabled={!transactions?.next}
            title="next"
            icon={
              <Arrow
                rotate={90}
                color={transactions?.next ? '#000000' : '#e1e1e1'}
              />
            }
          />
        </View>
      </View>

      {!!info && <Text testID="Info.Text">{info}</Text>}

      {transactions &&
        transactions.activityTransactions!.length > 0 &&
        transactions.activityTransactions!.map(
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
  }
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
