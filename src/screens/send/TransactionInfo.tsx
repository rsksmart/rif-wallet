import React, { useEffect, useState } from 'react'

import { Linking, StyleSheet, Text, View } from 'react-native'
import { CompassIcon, CopyIcon } from '../../components/icons'
import { SquareButton } from '../../components/button/SquareButton'

import { grid } from '../../styles/grid'

import { ContractTransaction, ContractReceipt } from 'ethers'
import Clipboard from '@react-native-community/clipboard'
import { colors } from '../../styles/colors'

type Props = {
  transaction: ContractTransaction
}

const TransactionInfo = ({ transaction }: Props) => {
  const [status, setStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED'>(
    'PENDING',
  )

  useEffect(() => {
    console.log('tx', transaction)
    // get the status
    transaction
      .wait()
      .then((reciept: ContractReceipt) =>
        setStatus(reciept.status === 1 ? 'SUCCESS' : 'FAILED'),
      )
  }, [transaction])

  return (
    <View style={styles.parent}>
      <Text style={styles.label}>You have just sent</Text>
      <Text style={styles.hash}>{transaction.to}</Text>

      <Text style={styles.label}>Status:</Text>
      <Text style={styles.label}>{status}</Text>

      <Text style={styles.hashLabel}>transaction hash</Text>

      <View style={grid.row}>
        <View style={{ ...grid.column6, ...styles.bottomColumn }}>
          <SquareButton
            onPress={() => Clipboard.setString(transaction.hash)}
            title="copy"
            testID="Hash.CopyButton"
            icon={<CopyIcon width={55} height={55} />}
          />
        </View>
        <View style={{ ...grid.column6, ...styles.bottomColumn }}>
          <SquareButton
            onPress={() =>
              Linking.openURL(`https://explorer.testnet.rsk.co/tx/${tx.hash}`)
            }
            title="open"
            testID="Hash.OpenURLButton"
            icon={<CompassIcon width={30} height={30} />}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    marginTop: 20,
  },
  label: {
    color: colors.white,
  },
  hash: {
    color: '#5C5D5D',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, .7)',
  },

  hashLabel: {
    color: '#5C5D5D',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  bottomColumn: {
    alignItems: 'center',
  },
})

export default TransactionInfo
