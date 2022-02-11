import React from 'react'
import RNLinearGradient from 'react-native-linear-gradient'

export const LinearGradient: React.FC<{
  style: any,
  colors: any
}> = ({ style, colors, children }) => <RNLinearGradient style={style} colors={colors}>
  {children}
</RNLinearGradient>
