import React, { useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../../styles'
import BaseButton from './BaseButton'
import { StyledButtonProps } from './StyledButton'

export const TransferButton: React.FC<StyledButtonProps> = ({
  style,
  disabled,
  title = 'transfer',
  ...props
}) => {
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
        <Text style={styles.text}>{title}</Text>
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
