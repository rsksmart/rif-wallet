import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { MediumText } from '../typography'
import { colors, spacing } from '../../styles'

type ButtonType = {
  icon: React.FC | any
  secondText: string
  containerBackground?: string | null
  secondTextColor?: string | null
  onPress: () => null
}

const ButtonCustom: React.FC<ButtonType> = ({
  icon = null,
  secondText,
  containerBackground = null,
  secondTextColor = null,
  onPress,
}) => {
  const overrideContainerBackground = containerBackground
    ? { backgroundColor: containerBackground }
    : {}
  const secondTextStyle = {
    color: secondTextColor || 'white',
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonTouchOpacity, overrideContainerBackground]}>
      <View style={spacing.mr10}>{icon}</View>
      <MediumText style={secondTextStyle}>{secondText}</MediumText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonTouchOpacity: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 40,
    backgroundColor: colors.background.button,
    alignSelf: 'flex-start',
    marginBottom: 20,
    alignItems: 'center',
    marginHorizontal: 25,
    paddingLeft: 25,
    paddingRight: 35,
  },
})
export default ButtonCustom
