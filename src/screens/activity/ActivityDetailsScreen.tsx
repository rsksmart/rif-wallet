import React from 'react'
import { StyleSheet, Text, View, Linking } from 'react-native'
import { Trans, useTranslation } from 'react-i18next'

import { utils } from 'ethers'

import { formatTimestamp, shortAddress } from '../../lib/utils'
import { Button } from '../../components'
import { Address } from '../../components'
import { IActivityTransaction } from './ActivityScreen'

export type ActivityDetailsScreenProps = {
  route: { params: IActivityTransaction }
}

export const ActivityDetailsScreen: React.FC<ActivityDetailsScreenProps> = ({
  route,
}) => {
  const { t } = useTranslation()

  const transaction = route.params
  return (
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
              <Address>{transaction.enhancedTransaction.from}</Address>
            </Text>
            <Text>
              <Trans>To</Trans>:{' '}
              <Address>{transaction.enhancedTransaction.to}</Address>
            </Text>
          </>
        ) : (
          <>
            <Text>
              <Trans>From</Trans>:{' '}
              {shortAddress(transaction.originTransaction.from)}
            </Text>
            <Text>
              <Trans>To</Trans>:{' '}
              {shortAddress(transaction.originTransaction.to)}
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
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  transactionDetailsTitle: {
    fontSize: 20,
    marginBottom: 10,
  },

  refreshButtonView: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
})
