import React from 'react'
import { fonts } from '../../styles/fonts'
import CustomText, { TextType } from './CustomText'

const RegularText: React.FC<TextType> = ({ children, ...props }) => (
  <CustomText font={fonts.regular} {...props}>
    {children}
  </CustomText>
)

export default RegularText
