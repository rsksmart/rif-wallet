import React from 'react'
import { ButtonProps } from './ButtonVariations'
import { PrimaryButton2 } from './PrimaryButton2'
import { SecondaryButton2 } from './SecondaryButton2'

type ActiveButtonType = {
  isActive?: boolean
}
const ActiveButton: React.FC<ActiveButtonType & ButtonProps> = ({
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
    return <PrimaryButton2 {...rest} style={buttonStyles} />
  }
  return <SecondaryButton2 {...rest} style={buttonStyles} />
}

export default ActiveButton
