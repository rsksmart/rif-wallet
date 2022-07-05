import React from 'react'
import { fonts } from '../../styles/fonts'
import CustomText, { TextType } from './CustomText'

const SemiBoldText: React.FC<TextType> = ({ children, ...props }) => (
  <CustomText font={fonts.semibold} {...props}>
    {children}
  </CustomText>
)

export default SemiBoldText
