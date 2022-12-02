import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'
import { ButtonProps } from './types'

interface ActiveButtonType extends ButtonProps {
  isActive?: boolean
}

export const ActiveButton = ({
  isActive = false,
  style,
  ...props
}: ActiveButtonType) => {
  const buttonStyles = {
    ...style,
    marginHorizontal: 10,
    width: 150,
  }

  return isActive ? (
    <PrimaryButton {...props} style={buttonStyles} />
  ) : (
    <SecondaryButton {...props} style={buttonStyles} />
  )
}
