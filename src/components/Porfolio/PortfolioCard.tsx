import { StyleSheet, View } from 'react-native'

import { sharedColors } from 'shared/constants'
import { TokenImage } from 'screens/home/TokenImage'
import { Typography } from 'components/typography'
import { colors } from 'src/styles'
import { AppTouchable } from 'components/appTouchable'

interface PortfolioCardProps {
  onPress: () => void
  color: string
  primaryText: string
  secondaryText: string
  isSelected: boolean
  icon?: string
  disabled?: boolean
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
      <Typography
        type={'body1'}
        style={selectedCardStyles.primaryText}
        accessibilityLabel="symbol">
        {primaryText}
      </Typography>
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
      <Typography
        type={'body1'}
        style={nonSelectedCardStyles.primaryText}
        accessibilityLabel="symbol">
        {primaryText}
      </Typography>
    </View>
    <View style={nonSelectedCardStyles.secondaryTextContainer}>
      <Typography
        type={'body1'}
        style={nonSelectedCardStyles.secondaryText}
        accessibilityLabel="balance">
        {secondaryText}
      </Typography>
    </View>
  </View>
)

export const PortfolioCard = ({
  onPress,
  color,
  primaryText,
  secondaryText,
  isSelected,
  icon,
  disabled,
}: PortfolioCardProps) => (
  <AppTouchable
    width={100}
    onPress={onPress}
    disabled={disabled}
    style={[styles.topContainer, { backgroundColor: color }]}
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
  </AppTouchable>
)

const styles = StyleSheet.create({
  topContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
    padding: 12,
    backgroundColor: sharedColors.inputInactive,
  },
})

const selectedCardStyles = StyleSheet.create({
  selectedCardContainer: {
    justifyContent: 'center',
    height: '100%',
  },

  primaryTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  icon: {
    marginTop: 0,
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
