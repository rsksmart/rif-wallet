import { StyleSheet, View } from 'react-native'

import { AppTouchable } from 'components/appTouchable'
import { Typography } from 'components/typography'
import { TokenImage } from 'screens/home/TokenImage'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'src/shared/utils'
import { selectHideBalance } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'

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
  color,
}: {
  primaryText: string
  icon?: string
  color?: string
}) => {
  const isRifToken = ['RIF', 'TRIF'].includes(icon?.toUpperCase() || '')
  return (
    <View style={selectedCardStyles.container}>
      <View style={selectedCardStyles.primaryTextContainer}>
        {icon ? (
          <View style={selectedCardStyles.icon}>
            <TokenImage
              symbol={icon}
              white={isRifToken}
              transparent
              color={color}
            />
          </View>
        ) : null}
        <Typography
          type={'body1'}
          style={
            primaryText.length > 4
              ? selectedCardStyles.primaryTextLong
              : selectedCardStyles.primaryText
          }
          accessibilityLabel="symbol">
          {primaryText}
        </Typography>
      </View>
    </View>
  )
}

const NonSelectedCard = ({
  primaryText,
  secondaryText,
  icon,
  hideBalance = false,
}: {
  primaryText: string
  secondaryText: string
  icon?: string
  hideBalance?: boolean
}) => (
  <View style={nonSelectedCardStyles.container}>
    <View style={nonSelectedCardStyles.primaryTextContainer}>
      {icon ? (
        <View style={nonSelectedCardStyles.icon}>
          <TokenImage symbol={icon} />
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
        numberOfLines={1}
        adjustsFontSizeToFit
        accessibilityLabel="balance">
        {hideBalance ? '\u002A\u002A\u002A\u002A' : secondaryText}
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
}: PortfolioCardProps) => {
  const hideBalance = useAppSelector(selectHideBalance)
  return (
    <AppTouchable
      width={100}
      disabled={disabled}
      style={[styles.topContainer, { backgroundColor: color }]}
      accessibilityLabel={primaryText}
      onPress={onPress}>
      {isSelected
        ? SelectedCard({
            primaryText,
            icon,
            color,
          })
        : NonSelectedCard({
            primaryText,
            secondaryText,
            icon,
            hideBalance,
          })}
    </AppTouchable>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
    padding: 12,
    backgroundColor: sharedColors.background.secondary,
  },
})

const selectedCardStyles = StyleSheet.create({
  container: castStyle.view({
    justifyContent: 'center',
    height: '100%',
  }),
  primaryTextContainer: castStyle.view({
    flexDirection: 'row',
  }),
  icon: castStyle.view({
    marginRight: 3,
    height: 20,
    width: 20,
  }),
  primaryText: castStyle.text({
    color: sharedColors.text.primary,
    fontSize: 22,
    paddingTop: 3,
  }),
  primaryTextLong: castStyle.text({
    fontSize: 18,
  }),
})

const nonSelectedCardStyles = StyleSheet.create({
  container: castStyle.view({
    justifyContent: 'space-between',
    height: '100%',
  }),
  primaryTextContainer: castStyle.view({
    flexDirection: 'row',
    alignItems: 'center',
  }),
  secondaryTextContainer: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  }),
  icon: castStyle.view({
    marginRight: 3,
  }),
  primaryText: castStyle.text({
    color: sharedColors.text.primary,
    fontSize: 16,
  }),
  secondaryText: castStyle.text({
    color: sharedColors.text.primary,
    fontSize: 16,
    right: 0,
  }),
})
