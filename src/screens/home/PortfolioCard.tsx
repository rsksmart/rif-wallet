import { TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, View } from 'react-native'

import { TokenImage } from './TokenImage'
import { RegularText } from 'components/index'
import { colors } from '../../styles'
import { sharedColors } from 'shared/constants'

interface BalancePresentationComponentProps {
  handlePress: () => void
  color: string
  topText: string
  bottomText: string
  icon?: string
}

export const PortfolioCard = ({
  handlePress,
  color,
  topText,
  bottomText,
  icon,
}: BalancePresentationComponentProps) => (
  <TouchableOpacity
    onPress={handlePress}
    style={{ ...styles.topContainer, backgroundColor: color }}
    accessibilityLabel={topText}>
    <View style={styles.container}>
      <View style={styles.topText}>
        {icon ? (
          <View style={styles.icon}>
            <TokenImage symbol={icon} height={18} width={18} />
          </View>
        ) : null}
        <RegularText style={styles.text} accessibilityLabel="symbol">
          {topText}
        </RegularText>
      </View>
      <View style={styles.bottomText}>
        <RegularText style={styles.balanceText} accessibilityLabel="balance">
          {bottomText}
        </RegularText>
        {/*<RegularText style={styles.textUsd} accessibilityLabel="usd">
          {usdAmount}
        </RegularText>*/}
      </View>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  topContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
    padding: 12,
    backgroundColor: sharedColors.darkGray,
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  topText: {
    flexDirection: 'row',
  },
  bottomText: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icon: {
    marginTop: 3,
    marginRight: 3,
    backgroundColor: colors.white,
    height: 18,
    width: 18,
    borderRadius: 20,
  },
  text: {
    color: colors.white,
    fontSize: 16,
  },
  balanceText: {
    color: colors.white,
    fontSize: 16,
    right: 0,
  },
})
