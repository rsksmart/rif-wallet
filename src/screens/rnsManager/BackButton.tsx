import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'

import { AppTouchable } from 'components/appTouchable'
import { rnsManagerStyles } from './rnsManagerStyles'
import { castStyle } from 'shared/utils'

interface Props {
  onPress: () => void
  accessibilityLabel: string
}

export const BackButton = ({ onPress, accessibilityLabel }: Props) => (
  <AppTouchable
    width={30}
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    style={styles.container}>
    <Icon
      name="chevron-thin-left"
      color={rnsManagerStyles.title.color}
      size={16}
    />
  </AppTouchable>
)

const styles = StyleSheet.create({
  container: castStyle.view({
    justifyContent: 'center',
  }),
})
