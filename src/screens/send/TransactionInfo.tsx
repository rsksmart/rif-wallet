import React, { useEffect, useState } from 'react'
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { colors, spacing } from '../../styles/'
import { TokenImage } from '../home/TokenImage'
import { SearchIcon } from '../../components/icons/SearchIcon'
import StatusIcon from '../../components/statusIcons'
import { transactionInfo } from './types'

interface Interface {
  transaction: transactionInfo
}

const TransactionInfo: React.FC<Interface> = ({ transaction }) => {
  const { token, amount, to, hash } = transaction

  const onViewExplorerTouch = () =>
    Linking.openURL(`https://explorer.testnet.rsk.co/tx/${hash}`)

  const onCopyHash = () => Clipboard.setString(hash || '')

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.label}>you have just sent</Text>
      <View style={styles.sentContainer}>
        {token && token.symbol && (
          <>
            <TokenImage symbol={token.symbol} height={17} width={17} />
            <Text style={[styles.font16Bold, spacing.ml7]}>{token.symbol}</Text>
          </>
        )}
        <Text style={[spacing.ml3, styles.font16Bold]}>{amount}</Text>
      </View>
      <View style={[spacing.mb30, spacing.mt7]}>
        {/* @TODO get real amount */}
        {/*<Text style={styles.font16}>$ 7439.55</Text>*/}
      </View>
      <Text style={styles.label}>to a recipient</Text>
      <View style={spacing.mb30}>
        <Text style={styles.font16Bold}>{to}</Text>
        <Text style={spacing.mt7}>{to}</Text>
      </View>
      <View style={spacing.mb30}>
        <Text style={styles.label}>status</Text>
        <View style={styles.sentContainer}>
          <View>
            <StatusIcon status={transaction.status} />
          </View>
          <Text style={styles.font16Bold}>
            {transaction.status.toLowerCase()}
          </Text>
        </View>
      </View>
      <View style={spacing.mb30}>
        <TouchableOpacity onPress={onCopyHash}>
          <Text style={styles.label}>tx hash</Text>
          <Text style={styles.font16Bold}>{transaction.hash}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={onViewExplorerTouch}
          testID="Hash.OpenURLButton">
          <View style={styles.buttonContainer}>
            <SearchIcon color="white" height={25} width={25} />
            <Text style={styles.buttonText}>view in explorer</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
    backgroundColor: colors.background.light,
    padding: 50,
  },
  flexDirRow: { flexDirection: 'row' },
  label: {
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 17,
  },
  font16: { fontSize: 16 },
  font16Bold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sentContainer: { flexDirection: 'row', alignItems: 'center' },
  buttonRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    backgroundColor: colors.background.button,
    padding: 15,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  buttonText: { color: 'white', marginLeft: 5 },
})

export default TransactionInfo
