import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, View } from 'react-native'
import { TokenImage } from './TokenImage'
import { Paragraph } from '../../components'
import { colors } from '../../styles'

type BalancePresentationComponentType = {
  handlePress: () => void
  containerStyles: { [key: string]: any }
  symbol: string
  balance: string
  usdAmount?: string
}

const BalanceCardPresentationComponent: React.FC<
  BalancePresentationComponentType
> = ({ handlePress, containerStyles, symbol, balance, usdAmount }) => (
  <TouchableOpacity onPress={handlePress} style={containerStyles}>
    <View style={styles.icon}>
      <TokenImage symbol={symbol} height={30} width={30} />
    </View>

    <Paragraph style={styles.text}>{symbol}</Paragraph>
    <Paragraph style={styles.text}>{balance}</Paragraph>
    <Paragraph style={styles.textUsd}>{usdAmount}</Paragraph>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  icon: {
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
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

export default BalanceCardPresentationComponent
