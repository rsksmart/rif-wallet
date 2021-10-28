import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Linking } from 'react-native'

import Button from '../../components/button'
import { Paragraph } from '../../components/typography'
import { IApiTransactions } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { RIFWallet } from '../../lib/core'
import { RifWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import { shortAddress } from '../../lib/utils'

const fetcher: RifWalletServicesFetcher = new RifWalletServicesFetcher()

interface IReceiveScreenProps {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const ActivityDetails = ({
  transaction,
}: {
  transaction: IApiTransactions
}) => (
  <View>
    <View>
      <Text style={styles.transactionDetailsTitle}>TransactionDetails</Text>
    </View>
    <View>
      <Text>From: {shortAddress(transaction.from)}</Text>
      <Text>To: {shortAddress(transaction.to)}</Text>
      <Text>TX Hash: {shortAddress(transaction.hash)}</Text>
      <Text>Gas: {transaction.gas}</Text>
      <Text>Gas Price: {transaction.gasPrice}</Text>
      <Text>
        Status: {transaction.receipt ? transaction.receipt.status : 'PENDING'}
      </Text>
      <Text>Time: {transaction.timestamp}</Text>
      <Button
        title="View in explorer"
        onPress={() => {
          Linking.openURL(
            `https://explorer.testnet.rsk.co/tx/${transaction.hash}`,
          )
        }}
      />
    </View>
  </View>
)

const ActivityRow = ({
  transaction,
  onSelected,
}: {
  transaction: IApiTransactions
  onSelected: (transaction: IApiTransactions) => void
}) => (
  <View style={styles.activityRow} testID={`${transaction.hash}.View`}>
    <View style={styles.activitySummary}>
      <Text>
        {transaction.value} sent To {shortAddress(transaction.hash)}{' '}
      </Text>
    </View>
    <View style={styles.button}>
      <Button
        onPress={() => {
          onSelected(transaction)
        }}
        title={'>'}
        testID={`${transaction.hash}.Button`}
      />
    </View>
  </View>
)

const ActivityScreen: React.FC<IReceiveScreenProps> = ({ route }) => {
  const account = route.params.account as RIFWallet

  const [info, setInfo] = useState('')
  const [transactions, setTransactions] = useState<IApiTransactions[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<
    undefined | IApiTransactions
  >()

  const enhanceTransactionInput = (transaction: IApiTransactions) => {
    const smartTx =
      account.smartWallet.smartWalletContract.interface.decodeFunctionData(
        'directExecute',
        transaction.input,
      )
    console.log({ smartTx })
    //TODO: call abi enhancer function
    return transaction
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
      console.log({ fetchedTransactions })
      const enhancedTransactions = fetchedTransactions.map(
        (tx: IApiTransactions) => enhanceTransactionInput(tx),
      )
      setTransactions(enhancedTransactions)
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
            transactions.map(transaction => (
              <ActivityRow
                key={transaction.hash}
                transaction={transaction}
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
          <ActivityDetails transaction={selectedTransaction} />
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
