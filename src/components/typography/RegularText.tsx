import { fonts } from '../../styles/fonts'
import { CustomText, TextType } from './CustomText'

const RegularText = ({ children, ...props }: TextType) => (
  <CustomText font={fonts.regular} {...props}>
    {children}
  </CustomText>
)

export default RegularText
