import React from 'react'
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'

import { ContentPasteIcon, SmileFaceIcon } from '../../components/icons'
import { grid } from '../../styles/grid'
import { colors } from '../../styles/colors'
import { TokenImage } from '../home/TokenImage'
import { BaseButton } from '../../components/button/BaseButton'
import { shortAddress } from '../../lib/utils'

export interface transactionInfo {
  to?: string
  value?: string
  symbol?: string
  hash?: string
  status: 'USER_CONFIRM' | 'PENDING' | 'SUCCESS' | 'FAILED'
}

type Props = {
  transaction: transactionInfo
}

const TransactionInfo = ({ transaction }: Props) => {
  if (transaction.status === 'USER_CONFIRM' || !transaction.hash) {
    return (
      <View style={styles.parent}>
        <Image
          source={require('../../images/transferWait.png')}
          style={styles.loading}
        />
        <Text style={styles.loadingReason}>transfering ...</Text>
      </View>
    )
  }

  return (
    <View style={styles.parent}>
      <Text style={styles.label}>You have just sent</Text>

      <View style={{ ...grid.row, ...styles.row }}>
        <View style={grid.column2}>
          {transaction.symbol && (
            <TokenImage symbol={transaction.symbol} height={50} width={50} />
          )}
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
        <Text style={styles.value}>{transaction.status}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => Clipboard.setString(transaction.hash || '')}>
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
  loading: {
    alignSelf: 'center',
    marginTop: '25%',
    marginBottom: 10,
  },
  loadingReason: {
    textAlign: 'center',
    color: colors.white,
  },
})

export default TransactionInfo
