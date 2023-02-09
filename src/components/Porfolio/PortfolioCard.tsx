import { TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, View } from 'react-native'

import { sharedColors } from 'shared/constants'
import { TokenImage } from 'screens/home/TokenImage'
import { RegularText } from 'src/components'
import { colors } from 'src/styles'

interface PortfolioCardProps {
  handlePress: () => void
  color: string
  primaryText: string
  secondaryText: string
  isSelected: boolean
  icon?: string
}

const SelectedCard = ({
  primaryText,
  icon,
}: {
  primaryText: string
  icon?: string
}) => (
  <View style={selectedCardStyles.selectedCardContainer}>
    <View style={selectedCardStyles.primaryTextContainer}>
      {icon ? (
        <View style={selectedCardStyles.icon}>
          <TokenImage symbol={icon} height={20} width={20} />
        </View>
      ) : null}
      <RegularText
        style={selectedCardStyles.primaryText}
        accessibilityLabel="symbol">
        {primaryText}
      </RegularText>
    </View>
  </View>
)

const NonSelectedCard = ({
  primaryText,
  secondaryText,
  icon,
}: {
  primaryText: string
  secondaryText: string
  icon?: string
}) => (
  <View style={nonSelectedCardStyles.container}>
    <View style={nonSelectedCardStyles.primaryTextContainer}>
      {icon ? (
        <View style={nonSelectedCardStyles.icon}>
          <TokenImage symbol={icon} height={18} width={18} />
        </View>
      ) : null}
      <RegularText
        style={nonSelectedCardStyles.primaryText}
        accessibilityLabel="symbol">
        {primaryText}
      </RegularText>
    </View>
    <View style={nonSelectedCardStyles.secondaryTextContainer}>
      <RegularText
        style={nonSelectedCardStyles.secondaryText}
        accessibilityLabel="balance">
        {secondaryText}
      </RegularText>
    </View>
  </View>
)

export const PortfolioCard = ({
  handlePress,
  color,
  primaryText,
  secondaryText,
  isSelected,
  icon,
}: PortfolioCardProps) => (
  <TouchableOpacity
    onPress={handlePress}
    style={{ ...styles.topContainer, backgroundColor: color }}
    accessibilityLabel={primaryText}>
    {isSelected
      ? SelectedCard({
          primaryText,
          icon,
        })
      : NonSelectedCard({
          primaryText,
          secondaryText,
          icon,
        })}
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
})

const selectedCardStyles = StyleSheet.create({
  selectedCardContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },

  primaryTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  icon: {
    marginTop: 7,
    marginRight: 3,
    backgroundColor: colors.white,
    height: 20,
    width: 20,
    borderRadius: 20,
  },
  primaryText: {
    color: colors.white,
    fontSize: 22,
  },
})

const nonSelectedCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  primaryTextContainer: {
    flexDirection: 'row',
  },

  secondaryTextContainer: {
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
  primaryText: {
    color: colors.white,
    fontSize: 16,
  },
  secondaryText: {
    color: colors.white,
    fontSize: 16,
    right: 0,
  },
})
