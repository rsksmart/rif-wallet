import React, { useEffect, useState } from 'react'
import { utils } from 'ethers'
import { StyleSheet, View, ScrollView, Text, Linking } from 'react-native'

import Button from '../../components/button'
import { Paragraph } from '../../components/typography'
import { IApiTransaction } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { RIFWallet } from '../../lib/core'
import { RifWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import { formatTimestamp, shortAddress } from '../../lib/utils'
import AbiEnhancer, { IEnhancedResult } from '../../lib/abiEnhancer/AbiEnhancer'
const enhancer = new AbiEnhancer()
const fetcher: RifWalletServicesFetcher = new RifWalletServicesFetcher()

interface IReceiveScreenProps {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const ActivityDetails = ({
  transaction,
  onSelected,
}: {
  transaction: IActivityTransaction
  onSelected: (transaction: IActivityTransaction | null) => void
}) => (
  <View>
    <View>
      <Text style={styles.transactionDetailsTitle}>TransactionDetails</Text>
    </View>
    <View>
      <Text>Token: {transaction.enhancedTransaction.symbol}</Text>
      <Text>Amount: {transaction.enhancedTransaction.value}</Text>
      <Text>From: {shortAddress(transaction.enhancedTransaction.from)}</Text>
      <Text>To: {shortAddress(transaction.enhancedTransaction.to)}</Text>
      <Text>TX Hash: {shortAddress(transaction.originTransaction.hash)}</Text>
      <Text>Gas: {transaction.originTransaction.gas}</Text>
      <Text>
        Gas Price:{' '}
        {utils.formatUnits(transaction.originTransaction.gasPrice, 'gwei')}
      </Text>
      <Text>
        Status:{' '}
        {transaction.originTransaction.receipt
          ? transaction.originTransaction.receipt.status
          : 'PENDING'}
      </Text>
      <Text>
        Time: {formatTimestamp(transaction.originTransaction.timestamp)}
      </Text>

      <Button
        title="View in explorer"
        onPress={() => {
          Linking.openURL(
            `https://explorer.testnet.rsk.co/tx/${transaction.originTransaction.hash}`,
          )
        }}
      />
      <Button
        title="Return to Activity Screen"
        onPress={() => {
          onSelected(null)
        }}
      />
    </View>
  </View>
)

const ActivityRow = ({
  key,
  activityTransaction,
  onSelected,
}: {
  key: string
  activityTransaction: IActivityTransaction
  onSelected: (transaction: IActivityTransaction) => void
}) => (
  <View
    key={key}
    style={styles.activityRow}
    testID={`${activityTransaction.originTransaction.hash}.View`}>
    <View style={styles.activitySummary}>
      <Text>
        {activityTransaction.enhancedTransaction.value}{' '}
        {activityTransaction.enhancedTransaction.symbol} sent To{' '}
        {shortAddress(activityTransaction.enhancedTransaction.to)}{' '}
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
  enhancedTransaction: IEnhancedResult
}
const ActivityScreen: React.FC<IReceiveScreenProps> = ({ route }) => {
  const account = route.params.account as RIFWallet

  const [info, setInfo] = useState('')
  const [transactions, setTransactions] = useState<IActivityTransaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<
    null | IActivityTransaction
  >()

  const enhanceTransactionInput = async (
    transaction: IApiTransaction,
  ): Promise<IEnhancedResult | null> => {
    const smartTx =
      account.smartWallet.smartWalletContract.interface.decodeFunctionData(
        'directExecute',
        transaction.input,
      )
    const enhancedTx: IEnhancedResult | null = await enhancer.enhance(account, {
      from: account.smartWalletAddress,
      to: smartTx.to.toLowerCase(),
      data: smartTx.data,
    })
    return enhancedTx
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setTransactions([])
      setInfo('Loading transactions. Please wait...')

      const fetchedTransactions = await fetcher.fetchTransactionsByAddress(
        account.smartWalletAddress.toLowerCase(),
      )

      const activityTransactions: IActivityTransaction[] = await Promise.all(
        fetchedTransactions.map(async (tx: IApiTransaction) => {
          const enhancedTransaction: IEnhancedResult | null =
            await enhanceTransactionInput(tx)
          return {
            originTransaction: tx,
            enhancedTransaction,
          }
        }),
      )
      console.log({ activityTransactions })
      setTransactions(activityTransactions)
      setInfo('')
    } catch (e) {
      setInfo('Error reaching API: ' + e.message)
    }
  }

  return (
    <ScrollView>
      {!selectedTransaction && (
        <View>
          <View>
            <Paragraph>{account.smartWalletAddress}</Paragraph>
          </View>

          <View>
            <Text>{info}</Text>
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
            <Button onPress={loadData} title={'Refresh'} />
          </View>
        </View>
      )}
      {selectedTransaction && (
        <View>
          <ActivityDetails
            transaction={selectedTransaction}
            onSelected={setSelectedTransaction}
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

export default ActivityScreen
