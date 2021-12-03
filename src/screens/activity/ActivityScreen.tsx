import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { useTranslation } from 'react-i18next'
import { Button } from '../../components'
import { IApiTransaction } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'

import { shortAddress } from '../../lib/utils'
import {
  IAbiEnhancer,
  IEnhancedResult,
} from '../../lib/abiEnhancer/AbiEnhancer'
import { ScreenWithWallet } from '../types'
import { formatBigNumber } from '../../lib/abiEnhancer/formatBigNumber'
import { Address } from '../../components'
import { NavigationProp } from '../../RootNavigation'

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
              18,
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
  navigation: NavigationProp
}

export const ActivityScreen: React.FC<ScreenWithWallet & ActivityScreenProps> =
  ({ wallet, fetcher, abiEnhancer, navigation }) => {
    const [info, setInfo] = useState('')
    const [transactions, setTransactions] = useState<IActivityTransaction[]>([])
    const { t } = useTranslation()

    const enhanceTransactionInput = async (
      transaction: IApiTransaction,
    ): Promise<IEnhancedResult | undefined> => {
      let tx
      try {
        tx =
          wallet.smartWallet.smartWalletContract.interface.decodeFunctionData(
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

    useEffect(() => {
      loadData()
    }, [])

    const loadData = async () => {
      /*i18n.changeLanguage('es')*/
      try {
        setTransactions([])
        setInfo(t('Loading transactions. Please wait...'))

        const fetchedTransactions = await fetcher.fetchTransactionsByAddress(
          wallet.smartWalletAddress.toLowerCase(),
        )
        const activityTransactions: IActivityTransaction[] = await Promise.all(
          fetchedTransactions.map(async (tx: IApiTransaction) => {
            const enhancedTransaction = await enhanceTransactionInput(tx)
            return {
              originTransaction: tx,
              enhancedTransaction,
            }
          }),
        )
        setTransactions(activityTransactions)
        setInfo('')
      } catch (e) {
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

          {transactions &&
            transactions.length > 0 &&
            transactions.map((activityTransaction: IActivityTransaction) => (
              <ActivityRow
                key={activityTransaction.originTransaction.hash}
                activityTransaction={activityTransaction}
                navigation={navigation}
              />
            ))}

          <View style={styles.refreshButtonView}>
            <Button
              onPress={loadData}
              title={t('Refresh')}
              testID={'Refresh.Button'}
            />
          </View>
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
  },
})
