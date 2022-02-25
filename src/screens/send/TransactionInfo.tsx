import React from 'react'

import { Linking, StyleSheet, Text, View } from 'react-native'
import { ContentPasteIcon, SmileFaceIcon } from '../../components/icons'

import { grid } from '../../styles/grid'

import Clipboard from '@react-native-community/clipboard'
import { colors } from '../../styles/colors'
import { TokenImage } from '../home/TokenImage'
import { BaseButton } from '../../components/button/BaseButton'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { shortAddress } from '../../lib/utils'

export interface transactionInfo {
  to: string
  value: string
  symbol: string
  hash: string
}

type Props = {
  transaction: transactionInfo
  status: string
}

const TransactionInfo = ({ transaction, status }: Props) => {
  return (
    <View style={styles.parent}>
      <Text style={styles.label}>You have just sent</Text>

      <View style={{ ...grid.row, ...styles.row }}>
        <View style={grid.column2}>
          <TokenImage symbol={transaction.symbol} height={50} width={50} />
        </View>
        <View style={grid.column9}>
          <Text style={{ ...styles.value, ...styles.amount }}>
            {transaction.value} {transaction.symbol}
          </Text>
        </View>
      </View>

      <Text style={styles.label}>To the recipient</Text>
      <View style={{ ...grid.row, ...styles.row }}>
        <View style={grid.column2}>
          <SmileFaceIcon height={50} width={50} color={colors.white} />
        </View>
        <View style={grid.column9}>
          <Text style={{ ...styles.value, ...styles.recipient }}>
            {transaction.to}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{status}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => Clipboard.setString(transaction.hash)}>
          <Text style={styles.label}>TX hash</Text>
          <Text style={styles.value}>
            {shortAddress(transaction.hash, 10)}
            <View style={styles.copy}>
              <ContentPasteIcon />
            </View>
            copy
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ ...grid.row, ...styles.buttons }}>
        <View style={{ ...grid.column6, ...grid.offset3 }}>
          <BaseButton
            onPress={() =>
              Linking.openURL(
                `https://explorer.testnet.rsk.co/tx/${transaction.hash}`,
              )
            }
            testID="Hash.OpenURLButton">
            <Text style={styles.explorerText}>view in explorer</Text>
          </BaseButton>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    marginTop: 20,
  },
  buttons: {
    marginTop: 100,
  },
  row: {
    marginBottom: 35,
  },
  label: {
    color: colors.white,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    color: colors.white,
    fontSize: 16,
  },
  amount: {
    marginTop: 15,
  },
  recipient: {
    marginTop: 7,
  },
  copy: {
    paddingLeft: 15,
    paddingRight: 5,
  },
  explorerText: {
    color: 'white',
  },
})

export default TransactionInfo
