import { TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'

import { sharedColors } from 'shared/constants'
import { SelectedCard } from './PortfolioSelectedCard'
import { NonSelectedCard } from './PortfolioNonSelectedCard'

interface BalancePresentationComponentProps {
  handlePress: () => void
  color: string
  primaryText: string
  secondaryText: string
  isSelected: boolean
  icon?: string
}

export const PortfolioCard = ({
  handlePress,
  color,
  primaryText,
  secondaryText,
  isSelected,
  icon,
}: BalancePresentationComponentProps) => (
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
