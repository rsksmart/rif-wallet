import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { SendButton } from '../../components/button/SendButton'
import { ReceiveButton } from '../../components/button/ReceiveButton'
import { grid } from '../../styles/grid'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { balanceToString } from '../balances/BalancesScreen'
import { TokenImage } from './TokenImage'

interface Interface {
  navigation: any
  token: ITokenWithBalance
}

const SelectedTokenComponent: React.FC<Interface> = ({ navigation, token }) => {
  return (
    <View style={{ ...grid.row, ...styles.amountRow }}>
      <View style={{ ...grid.column2, ...styles.icon }}>
        <TokenImage logo={token.logo} height={45} width={45} />
      </View>
      <View style={grid.column5}>
        <Text style={styles.amount}>
          {balanceToString(token.balance, token.decimals)}
        </Text>
      </View>
      <View style={grid.column}>
        <SendButton
          onPress={() => {
            navigation.navigate('Send', {
              token: token.symbol,
            })
          }}
          title="send"
        />
      </View>
      <View style={grid.column}>
        <ReceiveButton
          onPress={() => navigation.navigate('Receive')}
          title="receive"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  amountRow: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 20,
  },
  icon: {
    marginTop: 25,
    paddingLeft: 5,
  },
  amount: {
    color: '#5C5D5D',
    fontSize: 36,
    fontWeight: '500',
    marginTop: 25,
  },
})

export default SelectedTokenComponent
