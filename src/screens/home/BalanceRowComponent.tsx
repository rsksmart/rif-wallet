import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { grid } from '../../styles/grid'
import { balanceToString } from '../balances/BalancesScreen'
import { getTokenColorWithOpacity } from './tokenColor'
import { TokenImage } from './TokenImage'

export const BalanceRowComponent: React.FC<{
  token: ITokenWithBalance
  selected: boolean
  onPress: () => void
  quota: { price: number; lastUpdated: string } | undefined
}> = ({ selected, token, onPress, quota }) => {
  const containerStyles = {
    ...styles.container,
    backgroundColor: selected
      ? getTokenColorWithOpacity(token.symbol, 0.2)
      : '#efefef',
  }

  const priceDecimals = 2

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={containerStyles}>
        <View style={grid.row}>
          <View style={{ ...grid.column1, ...styles.icon }}>
            <TokenImage symbol={token.symbol} />
          </View>
          <View style={{ ...grid.column5, ...styles.tokenName }}>
            <Text>{token.name}</Text>
          </View>
          <View style={grid.column5}>
            <Text style={styles.balance}>{`${balanceToString(
              token.balance,
              token.decimals,
            )} ${token.symbol || ''}`}</Text>
            <Text style={styles.price}>
              {quota ? quota.price.toFixed(priceDecimals) : 0.0} USD
            </Text>
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
    marginTop: 3,
  },
  balance: {
    textAlign: 'right',
    marginTop: 3,
  },
  price: {
    color: '#66777e',
    fontSize: 10,
    letterSpacing: 0.06,
    textAlign: 'right',
  },
})
