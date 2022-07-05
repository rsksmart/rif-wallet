import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Paragraph } from '../../components'

import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { balanceToDisplay, balanceToUSD } from '../../lib/utils'
import { colors } from '../../styles/colors'
import { IPrice } from '../../subscriptions/types'
import { getTokenColor } from './tokenColor'
import { TokenImage } from './TokenImage'

export const BalanceCardComponent: React.FC<{
  token: ITokenWithBalance
  selected: boolean
  onPress: (address: string) => void
  price?: IPrice
}> = ({ selected, token, onPress, price }) => {
  const containerStyles = {
    ...styles.container,
    backgroundColor: selected
      ? getTokenColor(token.symbol)
      : 'rgba(0, 134, 255, .25)',
  }

  const usdAmount = price
    ? balanceToUSD(token.balance, token.decimals, price?.price)
    : ''

  const handlePress = () => onPress(token.contractAddress)

  return (
    <TouchableOpacity onPress={handlePress} style={containerStyles}>
      <View style={styles.icon}>
        <TokenImage symbol={token.symbol} height={30} width={30} />
      </View>

      <Paragraph style={styles.text}>{token.symbol}</Paragraph>
      <Paragraph style={styles.text}>
        {balanceToDisplay(token.balance, token.decimals, 4)}
      </Paragraph>
      <Paragraph style={styles.textUsd}>{usdAmount}</Paragraph>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  icon: {
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    paddingTop: 5,
    paddingLeft: 5,
    marginBottom: 15,
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
