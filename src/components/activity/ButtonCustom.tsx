import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'

type ButtonType = {
  firstText: string
  icon: React.FC | any
  secondText: string
  containerBackground?: string | null
  firstTextColor?: string | null
  firstTextBackgroundColor?: string | null
  secondTextColor?: string | null
  onPress: () => null
}

const ButtonCustom: React.FC<ButtonType> = ({
  firstText,
  icon = null,
  secondText,
  containerBackground = null,
  firstTextColor = null,
  firstTextBackgroundColor = null,
  secondTextColor = null,
  onPress,
}) => {
  const overrideContainerBackground = containerBackground
    ? { backgroundColor: containerBackground }
    : {}
  const firstTextStyle = { color: firstTextColor || 'white' }
  const firstTextBackgroundStyle = {
    backgroundColor:
      firstTextBackgroundColor || styles.buttonViewMain.backgroundColor,
  }
  const secondTextStyle = {
    color: secondTextColor || 'white',
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonTouchOpacity, overrideContainerBackground]}>
      <View style={[styles.buttonViewMain, firstTextBackgroundStyle]}>
        <Text style={firstTextStyle}>{firstText}</Text>
      </View>
      <View style={styles.marginRightView}>{icon}</View>
      <Text style={[secondTextStyle, styles.fontBold]}>{secondText}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonTouchOpacity: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 40,
    backgroundColor: '#050134',
    alignSelf: 'flex-start',
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonViewMain: {
    marginRight: 10,
    backgroundColor: 'rgba(219, 227, 255, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  fontBold: { fontWeight: 'bold' },
  marginRightView: {
    marginRight: 10,
  },
})
export default ButtonCustom
