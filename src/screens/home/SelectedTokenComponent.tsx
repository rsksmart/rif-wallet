import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { SendButton } from '../../components/button/SendButton'
import { ReceiveButton } from '../../components/button/ReceiveButton'
import { grid } from '../../styles/grid'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { balanceToString } from '../balances/BalancesScreen'
import { TokenImage } from './TokenImage'
import { getTokenColor } from './tokenColor'

interface Interface {
  navigation: any
  token: ITokenWithBalance
}

const SelectedTokenComponent: React.FC<Interface> = ({ navigation, token }) => {
  const tokenColor = getTokenColor(token.name)

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
          color={tokenColor}
          onPress={() => {
            navigation.navigate('Send', {
              token: token.name,
            })
          }}
          title="send"
        />
      </View>
      <View style={grid.column}>
        <ReceiveButton
          color={tokenColor}
          onPress={() => {
            navigation.navigate('Receive', {
              token: token.symbol,
            })
          }}
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
