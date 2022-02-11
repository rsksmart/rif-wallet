import React from 'react'
import { View } from 'react-native'
// import RNLinearGradient from 'react-native-linear-gradient'

export const LinearGradient: React.FC<{
  style: any,
  colors: any
}> = ({ style, colors, children }) => <View style={style}>
  {children}
</View>
