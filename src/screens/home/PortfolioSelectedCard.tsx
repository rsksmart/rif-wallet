import { StyleSheet, View } from 'react-native'

import { TokenImage } from './TokenImage'
import { RegularText } from 'components/index'
import { colors } from '../../styles'

export const SelectedCard = ({
  primaryText,
  icon,
}: {
  primaryText: string
  icon?: string
}) => (
  <View style={styles.selectedCardContainer}>
    <View style={styles.primaryTextContainer}>
      {icon ? (
        <View style={styles.icon}>
          <TokenImage symbol={icon} height={20} width={20} />
        </View>
      ) : null}
      <RegularText style={styles.primaryText} accessibilityLabel="symbol">
        {primaryText}
      </RegularText>
    </View>
  </View>
)

const styles = StyleSheet.create({
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
