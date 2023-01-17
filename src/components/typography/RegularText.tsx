import { fonts } from 'src/styles/fonts'
import { CustomText, TextType } from './CustomText'

export const RegularText = ({ children, ...props }: TextType) => (
  <CustomText font={fonts.regular} {...props}>
    {children}
  </CustomText>
)
