import React from 'react'
import { fonts } from '../../styles/fonts'
import CustomText, { TextType } from './CustomText'

const MediumText: React.FC<TextType> = ({ children, ...props }) => (
  <CustomText font={fonts.medium} {...props}>
    {children}
  </CustomText>
)

export default MediumText
