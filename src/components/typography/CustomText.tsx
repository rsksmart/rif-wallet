import React from 'react'
import { Text } from 'react-native'

type CustomTextType = {
  font: string
}

export type TextType = {
  children: React.ReactNode
  [key: string]: any
}
const CustomText: React.FC<CustomTextType & TextType> = ({
  font,
  children,
  ...props
}) => {
  const { style, ...rest } = props
  // Avoids overriding the font when passing style unless the developer does it
  const fontStyle = {
    fontFamily: font,
    ...(style && { ...style }),
  }
  return (
    <Text style={fontStyle} {...rest}>
      {children}
    </Text>
  )
}

export default CustomText
