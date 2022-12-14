import { ReactNode } from 'react'
import { Text, TextStyle } from 'react-native'

interface CustomTextType {
  font: string
}

export interface TextType {
  children: ReactNode
  style?: TextStyle
}
export const CustomText = ({
  font,
  children,
  ...props
}: CustomTextType & TextType) => {
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
