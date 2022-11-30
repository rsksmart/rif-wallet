import { StyledButtonProps } from './StyledButton'
import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'

interface ActiveButtonType extends StyledButtonProps {
  isActive?: boolean
}
const ActiveButton = ({
  isActive = false,
  style,
  ...rest
}: ActiveButtonType) => {
  const buttonStyles = {
    ...style,
    marginHorizontal: 10,
    width: 150,
  }

  if (isActive) {
    return <PrimaryButton {...rest} style={buttonStyles} />
  }
  return <SecondaryButton {...rest} style={buttonStyles} />
}

export default ActiveButton
