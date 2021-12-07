import React, { useEffect, useState } from 'react'
import { utils, BigNumber } from 'ethers'
import { StyleSheet, View, ScrollView, Text, Linking } from 'react-native'

import { Trans, useTranslation } from 'react-i18next'
import { Button } from '../../components'
import {
  IApiTransaction,
  TransactionsServerResponse,
} from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'

import { formatTimestamp, shortAddress } from '../../lib/utils'
import {
  IAbiEnhancer,
  IEnhancedResult,
} from '../../lib/abiEnhancer/AbiEnhancer'
import { ScreenWithWallet } from '../types'
import { formatBigNumber } from '../../lib/abiEnhancer/formatBigNumber'
import { Address } from '../../components'
import { RIFWallet } from '../../lib/core'

const RBTC_DECIMALS = 18

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

interface TransactionsServerResponseWithActivityTransactions
  extends TransactionsServerResponse {
  activityTransactions?: IActivityTransaction[]
}

export const ActivityScreen: React.FC<ScreenWithWallet & ActivityScreenProps> =
  ({ wallet, fetcher, abiEnhancer }) => {
    const [info, setInfo] = useState('')
    const [transactions, setTransactions] =
      useState<TransactionsServerResponseWithActivityTransactions | null>(null)
    const [selectedActivityTransaction, setSelectedActivityTransaction] =
      useState<null | IActivityTransaction>()
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
        {!selectedActivityTransaction && (
          <View>
            <Address testID={'Address.Paragraph'}>
              {wallet.smartWalletAddress}
            </Address>

            <View>
              <Text testID="Info.Text">{info}</Text>
            </View>
            <View style={styles.refreshButtonView}>
              <Button
                onPress={() =>
                  fetchTransactionsPage({ prev: transactions?.prev })
                }
                disabled={!transactions?.prev}
                title={t('< Prev')}
              />
              <Button
                onPress={() => fetchTransactionsPage()}
                title={t('Refresh')}
                testID={'Refresh.Button'}
              />
              <Button
                onPress={() =>
                  fetchTransactionsPage({ next: transactions?.next })
                }
                disabled={!transactions?.next}
                title={t('Next >')}
              />
            </View>

            {transactions &&
              transactions.activityTransactions &&
              transactions.activityTransactions.length > 0 &&
              transactions.activityTransactions.map(
                (activityTransaction: IActivityTransaction) => (
                  <ActivityRow
                    key={activityTransaction.originTransaction.hash}
                    activityTransaction={activityTransaction}
                    onSelected={setSelectedActivityTransaction}
                  />
                ),
              )}
          </View>
        )}
        {selectedActivityTransaction && (
          <View>
            <ActivityDetails
              transaction={selectedActivityTransaction}
              onSelected={setSelectedActivityTransaction}
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
