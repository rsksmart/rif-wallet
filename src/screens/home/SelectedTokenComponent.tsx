import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { grid } from '../../styles/grid'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { balanceToString } from '../balances/BalancesScreen'
import { TokenImage } from './TokenImage'
import { getTokenColor } from './tokenColor'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow } from '../../components/icons'

interface Interface {
  navigation: any
  token: ITokenWithBalance
}

const SelectedTokenComponent: React.FC<Interface> = ({ navigation, token }) => {
  const tokenColor = getTokenColor(token.symbol)

  return (
    <View style={{ ...grid.row, ...styles.amountRow }}>
      <View style={{ ...grid.column2, ...styles.icon }}>
        <TokenImage symbol={token.symbol} height={45} width={45} />
      </View>
      <View style={grid.column5}>
        <Text style={styles.amount}>
          {balanceToString(token.balance, token.decimals)}
        </Text>
      </View>
      <View style={grid.column}>
        <SquareButton
          color={tokenColor}
          onPress={() => {
            navigation.navigate('Send', {
              token: token.name,
            })
          }}
          title="send"
          icon={<Arrow color={tokenColor} rotate={45} />}
        />
      </View>
      <View style={grid.column}>
        <SquareButton
          color={tokenColor}
          onPress={() => {
            navigation.navigate('Receive', {
              token: token.symbol,
            })
          }}
          title="receive"
          icon={<Arrow color={tokenColor} rotate={225} />}
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
