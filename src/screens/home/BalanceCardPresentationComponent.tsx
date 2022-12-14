import { TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, View, ViewStyle } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Shine,
} from 'rn-placeholder'

import { TokenImage } from './TokenImage'
import { RegularText } from 'components/index'
import { colors } from '../../styles'

interface BalancePresentationComponentProps {
  handlePress: () => void
  containerStyles: ViewStyle
  symbol: string
  balance: string
  usdAmount?: string
}

export const BalanceCardPresentationComponent = ({
  handlePress,
  containerStyles,
  symbol,
  balance,
  usdAmount,
}: BalancePresentationComponentProps) => (
  <TouchableOpacity
    onPress={handlePress}
    style={containerStyles}
    accessibilityLabel={symbol}>
    {!balance || !usdAmount ? (
      <Placeholder
        style={styles.placeholder}
        Animation={props => <Shine {...props} reverse={true} />}>
        <PlaceholderMedia style={styles.placeholderMedia} />
        <PlaceholderLine />
        <PlaceholderLine />
        <PlaceholderLine />
      </Placeholder>
    ) : (
      <>
        <View style={styles.icon}>
          <TokenImage symbol={symbol} height={30} width={30} />
        </View>

        <RegularText style={styles.text} accessibilityLabel="symbol">
          {symbol}
        </RegularText>
        <RegularText style={styles.balanceText} accessibilityLabel="balance">
          {balance}
        </RegularText>
        <RegularText style={styles.textUsd} accessibilityLabel="usd">
          {usdAmount}
        </RegularText>
      </>
    )}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  placeholder: { width: '100%', height: '100%' },
  placeholderMedia: { marginBottom: 25, borderRadius: 20, overflow: 'hidden' },
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
  balanceText: {
    color: colors.white,
    fontSize: 26,
    marginBottom: 10,
  },
  textUsd: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
})
