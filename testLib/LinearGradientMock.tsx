import React from 'react'
import { View } from 'react-native'

interface Interface {
  children: any
}

const LinearGradientMock: React.FC<Interface> = ({ children }) => {
  return <View>{children}</View>
}

export default LinearGradientMock
