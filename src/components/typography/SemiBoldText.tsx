import { fonts } from '../../styles/fonts'
import { CustomText, TextType } from './CustomText'

const SemiBoldText = ({ children, ...props }: TextType) => (
  <CustomText font={fonts.semibold} {...props}>
    {children}
  </CustomText>
)

export default SemiBoldText
