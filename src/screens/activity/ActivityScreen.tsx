import React, { useEffect, useState } from 'react'
import { utils, BigNumber } from 'ethers'
import { StyleSheet, View, ScrollView, Text, Linking } from 'react-native'

import { Trans, useTranslation } from 'react-i18next'
import { Button } from '../../components'
import { Paragraph } from '../../components'
import { IApiTransaction } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'

import { formatTimestamp, shortAddress } from '../../lib/utils'
import {
  IAbiEnhancer,
  IEnhancedResult,
} from '../../lib/abiEnhancer/AbiEnhancer'
import { ScreenWithWallet } from '../types'
import { formatBigNumber } from '../../lib/abiEnhancer/formatBigNumber'
import { Address } from '../../components/address'

interface IReceiveScreenProps {
  route: any
}

const ActivityDetails = ({
  transaction,
  onSelected,
  t,
}: {
  transaction: IActivityTransaction
  onSelected: (transaction: IActivityTransaction | null) => void
  t: any
}) => (
  <View>
    <View>
      <Text testID="txDetailsTitle" style={styles.transactionDetailsTitle}>
        <Trans>Transaction Details</Trans>
      </Text>
    </View>
    <View>
      {transaction.enhancedTransaction ? (
        <>
          <Text>
            <Trans>Token</Trans>: {transaction.enhancedTransaction.symbol}
          </Text>
          <Text>
            <Trans>Amount</Trans>: {transaction.enhancedTransaction.value}
          </Text>
          <Text>
            <Trans>From</Trans>:
            {shortAddress(transaction.enhancedTransaction.from)}
          </Text>
          <Text>
            <Trans>To</Trans>:{' '}
            {shortAddress(transaction.enhancedTransaction.to)}
          </Text>
        </>
      ) : (
        <>
          <Text>
            <Trans>From</Trans>:{' '}
            {shortAddress(transaction.originTransaction.from)}
          </Text>
          <Text>
            <Trans>To</Trans>: {shortAddress(transaction.originTransaction.to)}
          </Text>
          <Text>
            <Trans>Amount</Trans>: {transaction.originTransaction.value}
          </Text>
          <Text>
            <Trans>Data</Trans>: {transaction.originTransaction.data}
          </Text>
        </>
      )}
      <Text>
        <Trans>TX Hash</Trans>:{' '}
        {shortAddress(transaction.originTransaction.hash)}
      </Text>
      <Text>
        <Trans>Gas</Trans>: {transaction.originTransaction.gas}
      </Text>
      <Text>
        <Trans>Gas Price</Trans>:{' '}
        {utils.formatUnits(transaction.originTransaction.gasPrice, 'gwei')}
      </Text>
      <Text>
        <Trans>Status</Trans>:{' '}
        {transaction.originTransaction.receipt
          ? transaction.originTransaction.receipt.status
          : 'PENDING'}
      </Text>
      <Text>
        <Trans>Time</Trans>:{' '}
        {formatTimestamp(transaction.originTransaction.timestamp)}
      </Text>

      <Button
        title={t('View in explorer')}
        onPress={() => {
          Linking.openURL(
            `https://explorer.testnet.rsk.co/tx/${transaction.originTransaction.hash}`,
          )
        }}
      />
      <Button
        title={t('Return to Activity Screen')}
        onPress={() => {
          onSelected(null)
        }}
      />
    </View>
  </View>
)

const ActivityRow = ({
  activityTransaction,
  onSelected,
}: {
  activityTransaction: IActivityTransaction
  onSelected: (transaction: IActivityTransaction) => void
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
          onSelected(activityTransaction)
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

export const ActivityScreen: React.FC<ScreenWithWallet & ActivityScreenProps> =
  ({ wallet, fetcher, abiEnhancer }) => {
    const [info, setInfo] = useState('')
    const [transactions, setTransactions] = useState<IActivityTransaction[]>([])
    const [selectedTransaction, setSelectedTransaction] =
      useState<null | IActivityTransaction>()
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
        {!selectedTransaction && (
          <View>
            <Paragraph testID={'Address.Paragraph'}>
              {wallet.smartWalletAddress}
            </Paragraph>

            <View>
              <Text testID="Info.Text">{info}</Text>
            </View>

            {transactions &&
              transactions.length > 0 &&
              transactions.map((activityTransaction: IActivityTransaction) => (
                <ActivityRow
                  key={activityTransaction.originTransaction.hash}
                  activityTransaction={activityTransaction}
                  onSelected={setSelectedTransaction}
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
        )}
        {selectedTransaction && (
          <View>
            <ActivityDetails
              transaction={selectedTransaction}
              onSelected={setSelectedTransaction}
              t={t}
            />
          </View>
        )}
      </ScrollView>
    )
  }

const styles = StyleSheet.create({
  activityRow: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  transactionDetailsTitle: {
    fontSize: 20,
    marginBottom: 10,
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
