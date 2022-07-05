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
  let styles = style

  if (styles && Array.isArray(style)) {
    styles = style.reduce((p, c) => {
      Object.assign(p, c)
      return p
    }, {})
  }
  // Avoids overriding the font when passing style unless the developer does it
  const fontStyle = {
    fontFamily: font,
    ...(styles && { ...styles }),
  }
  return (
    <Text style={fontStyle} {...rest}>
      {children}
    </Text>
  )
}

export default CustomText
