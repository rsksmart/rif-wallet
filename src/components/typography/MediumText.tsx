import { fonts } from '../../styles/fonts'
import { CustomText, TextType } from './CustomText'

const MediumText = ({ children, ...props }: TextType) => (
  <CustomText font={fonts.medium} {...props}>
    {children}
  </CustomText>
)

export default MediumText
