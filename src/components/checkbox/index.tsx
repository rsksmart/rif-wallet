import { View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { castStyle } from 'shared/utils'
import { sharedColors } from 'src/shared/constants'

interface Props {
  isEnabled: boolean
}

export const Checkbox = ({ isEnabled }: Props) => {
  return (
    <View style={[styles.checkbox, isEnabled ? styles.checkboxEnabled : null]}>
      {isEnabled ? (
        <Icon name={'check'} color={sharedColors.white} size={9} />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  checkbox: castStyle.view({
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: sharedColors.borderColor,
    height: 16,
    width: 16,
    borderRadius: 4,
    backgroundColor: sharedColors.inputInactiveColor,
    overflow: 'hidden',
  }),
  checkboxEnabled: castStyle.view({
    backgroundColor: sharedColors.primary,
  }),
})
