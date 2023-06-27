import { useState } from 'react'
import { StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { colors } from 'src/styles'

import { MediumText } from '../typography'
import BaseButton from './BaseButton'
import { ButtonProps } from './types'

export const TransferButton = ({
  style,
  disabled,
  title = 'transfer',
  ...props
}: ButtonProps) => {
  const [isPressed, setIsPressed] = useState(false)

  const gradientColors = isPressed
    ? [colors.lightPurple, colors.darkPurple]
    : [colors.darkPurple, colors.lightPurple]

  styles.container.opacity = disabled ? 0.5 : 1

  return (
    <LinearGradient
      colors={gradientColors}
      useAngle={true}
      style={{ ...style, ...styles.container }}>
      <BaseButton
        {...props}
        underlayColor="transparent"
        disabled={disabled}
        onShowUnderlay={() => setIsPressed(true)}
        onHideUnderlay={() => setIsPressed(false)}>
        <MediumText style={styles.text}>{title}</MediumText>
      </BaseButton>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 25,
    opacity: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.darkPurple3,
    fontWeight: '600',
  },
})
