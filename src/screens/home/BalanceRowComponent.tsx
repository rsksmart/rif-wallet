import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Paragraph } from '../../components'

import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { balanceToString } from '../balances/BalancesScreen'
import { getTokenColorWithOpacity } from './tokenColor'
import { TokenImage } from './TokenImage'

export const BalanceRowComponent: React.FC<{
  token: ITokenWithBalance
  selected: boolean
  onPress: (address: string) => void
  // quota?: { price: number; lastUpdated: string }
}> = ({ /* selected, token, onPress, quota*/ onPress, token }) => {
  const containerStyles = {
    // ...grid.column6,
    ...styles.container,
    /*
    backgroundColor: selected
      ? getTokenColorWithOpacity(token.symbol, 0.2)
      : '#efefef',
      */
  }

  const priceDecimals = 2
  const handlePress = () => onPress(token.contractAddress)

  console.log(token)

  if (!token) {
    return <></>
  }

  return (
    <TouchableOpacity onPress={handlePress} style={containerStyles}>
      <View style={styles.icon}>
        <TokenImage symbol={token.symbol} height={30} width={30} />
      </View>

      <Paragraph style={styles.text}>{token.symbol}</Paragraph>
      <Paragraph style={styles.text}>
        {balanceToString(token.balance, token.decimals)}
      </Paragraph>
      <Paragraph style={styles.textUsd}>$1.00</Paragraph>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 134, 255, .25)',
    // flexBasis: '100%',
    // flex: 1,
    // width: '50%', // 150,

    // width: '50%',
    borderRadius: 25,
    padding: 10,
    marginBottom: 15,
    paddingHorizontal: 20,
    // width: '100%',
    // height: 180,
    // width: '50%',
  },
  icon: {
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    paddingTop: 5,
    paddingLeft: 5,
    marginBottom: 15,
    // margin: 10,
    // paddingTop: 3,
    // paddingLeft: 2,
  },
  text: {
    color: colors.white,
    fontSize: 26,
    marginBottom: 0,
    marginTop: 10,
  },
  textUsd: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
})
