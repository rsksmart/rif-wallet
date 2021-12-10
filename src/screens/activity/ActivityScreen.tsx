import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { useTranslation } from 'react-i18next'
import { Button } from '../../components'
import {
  IApiTransaction,
  TransactionsServerResponse,
} from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'

import { shortAddress } from '../../lib/utils'
import {
  IAbiEnhancer,
  IEnhancedResult,
} from '../../lib/abiEnhancer/AbiEnhancer'
import { ScreenWithWallet } from '../types'
import { formatBigNumber } from '../../lib/abiEnhancer/formatBigNumber'
import { Address } from '../../components'
import { NavigationProp, ScreenProps } from '../../RootNavigation'
import { RIFWallet } from '../../lib/core'

const RBTC_DECIMALS = 18

const ActivityRow = ({
  activityTransaction,
  navigation,
}: {
  activityTransaction: IActivityTransaction
  navigation: NavigationProp
}) => (
  <View
    key={activityTransaction.originTransaction.hash}
    style={styles.activityRow}
    testID={`${activityTransaction.originTransaction.hash}.View`}>
    <View style={styles.activitySummary}>
      <Text>
        {activityTransaction.enhancedTransaction ? (
          <>
            <Text testID={`${activityTransaction.originTransaction.hash}.Text`}>
              {`${activityTransaction.enhancedTransaction.value} ${activityTransaction.enhancedTransaction.symbol} sent To `}
            </Text>
            <Address>{activityTransaction.enhancedTransaction.to}</Address>
          </>
        ) : (
          <>
            {formatBigNumber(
              BigNumber.from(activityTransaction.originTransaction.value),
              RBTC_DECIMALS,
            )}
            {' RBTC'}
            {shortAddress(activityTransaction.originTransaction.to)}{' '}
          </>
        )}
      </Text>
    </View>
    <View style={styles.button}>
      <Button
        onPress={() => {
          navigation.navigate('ActivityDetails', activityTransaction)
        }}
        title={'>'}
        testID={`${activityTransaction.originTransaction.hash}.Button`}
      />
    </View>
  </View>
)
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
    <ScrollView>
      <View>
        <Address testID={'Address.Paragraph'}>
          {wallet.smartWalletAddress}
        </Address>

        <View>
          <Text testID="Info.Text">{info}</Text>
        </View>
        <View style={styles.refreshButtonView}>
          <Button
            onPress={() => fetchTransactionsPage({ prev: transactions?.prev })}
            disabled={!transactions?.prev}
            title={t('< Prev')}
          />
          <Button
            onPress={() => fetchTransactionsPage()}
            title={t('Refresh')}
            testID={'Refresh.Button'}
          />
          <Button
            onPress={() => fetchTransactionsPage({ next: transactions?.next })}
            disabled={!transactions?.next}
            title={t('Next >')}
          />
        </View>

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
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  activityRow: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  activitySummary: {
    position: 'absolute',
    left: 0,
  },
  button: {
    position: 'absolute',
    right: 0,
  },
  refreshButtonView: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
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
