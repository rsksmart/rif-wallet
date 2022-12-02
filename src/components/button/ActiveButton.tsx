import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'
import { ButtonProps } from './types'

interface ActiveButtonType extends ButtonProps {
  isActive?: boolean
}
export const ActiveButton = ({
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
