import { StyleSheet, View } from 'react-native'

import { TokenImage } from './TokenImage'
import { RegularText } from 'components/index'
import { colors } from '../../styles'

export const NonSelectedCard = ({
  primaryText,
  secondaryText,
  icon,
}: {
  primaryText: string
  secondaryText: string
  icon?: string
}) => (
  <View style={styles.container}>
    <View style={styles.primaryTextContainer}>
      {icon ? (
        <View style={styles.icon}>
          <TokenImage symbol={icon} height={18} width={18} />
        </View>
      ) : null}
      <RegularText style={styles.primaryText} accessibilityLabel="symbol">
        {primaryText}
      </RegularText>
    </View>
    <View style={styles.secondaryTextContainer}>
      <RegularText style={styles.secondaryText} accessibilityLabel="balance">
        {secondaryText}
      </RegularText>
    </View>
  </View>
)

const styles = StyleSheet.create({
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
