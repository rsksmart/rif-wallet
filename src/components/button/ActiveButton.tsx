import React from 'react'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import { BaseButtonInterface } from './BaseButton'
import { MediumText } from '../typography'
import { colors } from '../../styles'

type ActiveButtonType = {
  isActive?: boolean
  text: React.FC | string
  TextComp?: React.FC | undefined
}
const ActiveButton: React.FC<ActiveButtonType & BaseButtonInterface> = ({
  isActive,
  text,
  TextComp = MediumText,
  ...rest
}) => {
  // UX Fix for typography
  const commonTextStyles = {
    top: 0.3,
  }
  if (isActive) {
    return (
      <PrimaryButton {...rest}>
        <TextComp style={{ color: colors.text.primary, ...commonTextStyles }}>
          {text}
        </TextComp>
      </PrimaryButton>
    )
  }

  return (
    <SecondaryButton {...rest}>
      <TextComp style={{ color: colors.darkPurple3, ...commonTextStyles }}>
        {text}
      </TextComp>
    </SecondaryButton>
  )
}

export default ActiveButton
