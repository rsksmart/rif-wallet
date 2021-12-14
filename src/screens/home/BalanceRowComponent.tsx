import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { grid } from '../../styles/grid'
import { balanceToString } from '../balances/BalancesScreen'
import { getTokenColor } from './tokenColor'
import { TokenImage } from './TokenImage'

export const BalanceRowComponent: React.FC<{
  token: ITokenWithBalance
  selected: boolean
  onPress: () => void
}> = ({ selected, token, onPress }) => {
  const containerStyles = {
    ...styles.container,
    backgroundColor: selected ? getTokenColor(token.name) : '#efefef',
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={containerStyles}>
        <View style={grid.row}>
          <View style={{ ...grid.column1, ...styles.icon }}>
            <TokenImage logo={token.logo} />
          </View>
          <View style={{ ...grid.column5, ...styles.tokenName }}>
            <Text>{token.name}</Text>
          </View>
          <View style={grid.column5}>
            <Text style={styles.balance}>{`${balanceToString(
              token.balance,
              token.decimals,
            )} ${token.symbol}`}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    padding: 10,
    marginBottom: 15,
  },
  icon: {
    backgroundColor: '#ffffff',
    height: 26,
    borderRadius: 12,
    paddingTop: 3,
    paddingLeft: 2,
  },
  tokenName: {
    marginLeft: 15,
  },
  balance: {
    textAlign: 'right',
  },
})
