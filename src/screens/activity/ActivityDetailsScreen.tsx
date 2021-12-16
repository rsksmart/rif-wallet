import React from 'react'
import { StyleSheet, Text, View, Linking } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'

import { utils } from 'ethers'

import { formatTimestamp } from '../../lib/utils'
import { Address } from '../../components'
import { IActivityTransaction } from './ActivityScreen'
import LinearGradient from 'react-native-linear-gradient'
import { getTokenColor, setOpacity } from '../home/tokenColor'
import { grid } from '../../styles/grid'
import { ScrollView } from 'react-native-gesture-handler'
import { SquareButton } from '../../components/button/SquareButton'
import { CompassIcon } from '../../components/icons'

export type ActivityDetailsScreenProps = {
  route: { params: IActivityTransaction }
}

const ActivityRow: React.FC<{ title: any; content: any }> = ({
  title,
  content,
}) => (
  <View style={{ ...grid.row, ...styles.row }}>
    <View style={grid.column3}>
      <Text style={styles.label}>{title}</Text>
    </View>
    <View style={grid.column9}>
      <Text>{content}</Text>
    </View>
  </View>
)

export const ActivityDetailsScreen: React.FC<ActivityDetailsScreenProps> = ({
  route,
}) => {
  const { t } = useTranslation()
  const transaction = route.params
  const tokenColor = getTokenColor(transaction.enhancedTransaction?.symbol)

  return (
    <LinearGradient
      style={styles.parent}
      colors={['#ffffff', setOpacity(tokenColor, 0.1)]}>
      <Text style={styles.header} testID="txDetailsTitle">
        <Trans>Transaction Details</Trans>
      </Text>

      <ScrollView style={styles.transaction}>
        {transaction.enhancedTransaction ? (
          <>
            <ActivityRow
              title="Token"
              content={transaction.enhancedTransaction.symbol}
            />
            <ActivityRow
              title="Amount"
              content={transaction.enhancedTransaction.value}
            />
            <ActivityRow
              title="From"
              content={
                <Address>{transaction.enhancedTransaction.from}</Address>
              }
            />
            <ActivityRow
              title="To"
              content={<Address>{transaction.enhancedTransaction.to}</Address>}
            />
          </>
        ) : (
          <>
            <ActivityRow
              title="From"
              content={<Address>{transaction.originTransaction.from}</Address>}
            />
            <ActivityRow
              title="To"
              content={<Address>{transaction.originTransaction.to}</Address>}
            />
            <ActivityRow
              title="Amount"
              content={transaction.originTransaction.value}
            />
            <ActivityRow
              title="Data"
              content={transaction.originTransaction.data}
            />
          </>
        )}
        <ActivityRow
          title="TX Hash"
          content={<Address>{transaction.originTransaction.hash}</Address>}
        />
        <ActivityRow title="Gas" content={transaction.originTransaction.gas} />

        <ActivityRow
          title={<Trans>Gas Price</Trans>}
          content={utils.formatUnits(transaction.originTransaction.gasPrice)}
        />

        <ActivityRow
          title={<Trans>Status</Trans>}
          content={
            transaction.originTransaction.receipt
              ? transaction.originTransaction.receipt.status
              : 'PENDING'
          }
        />

        <ActivityRow
          title={<Trans>Time</Trans>}
          content={formatTimestamp(transaction.originTransaction.timestamp)}
        />
      </ScrollView>

      <View style={{ ...grid.row, ...styles.explorerRow }}>
        <SquareButton
          title="explorer"
          onPress={() =>
            Linking.openURL(
              `https://explorer.testnet.rsk.co/tx/${transaction.originTransaction.hash}`,
            )
          }
          icon={<CompassIcon color={tokenColor} />}
        />
      </View>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
  transaction: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
  },
  label: {
    fontWeight: '600',
  },
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
  explorerRow: {
    justifyContent: 'center',
    marginBottom: 10,
  },
})
