import React from 'react'
import { StyledButtonProps } from './StyledButton'
import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'

type ActiveButtonType = {
  isActive?: boolean
}
const ActiveButton: React.FC<ActiveButtonType & StyledButtonProps> = ({
  isActive = false,
  style,
  ...rest
}) => {
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
