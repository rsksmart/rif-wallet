import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { RegularText } from '../typography'
import BaseButton from './BaseButton'
import { StyledButtonProps } from './types'

export const StyledButton = ({
  title,
  disabled,
  icon,
  style,
  buttonStyles,
  ...props
}: StyledButtonProps) => {
  const [isPressed, setIsPressed] = useState(false)

  let baseButtonStyle = buttonStyles.button
  if (isPressed) {
    baseButtonStyle = buttonStyles.buttonPressed
  } else if (disabled) {
    baseButtonStyle = buttonStyles.buttonDisabled
  }

  let underlayColor = buttonStyles.buttonPressed?.backgroundColor
  if (isPressed) {
    if (disabled) {
      underlayColor = buttonStyles.buttonDisabled.backgroundColor
    } else {
      underlayColor = buttonStyles.buttonActive.backgroundColor
    }
  }

  let textStyle = buttonStyles.text
  if (isPressed) {
    textStyle = buttonStyles.textPressed
  } else if (disabled) {
    textStyle = buttonStyles.textDisabled
  }

  return (
    <BaseButton
      {...props}
      style={{ ...style, ...baseButtonStyle }}
      underlayColor={underlayColor}
      disabled={disabled}
      onShowUnderlay={() => setIsPressed(true)}
      onHideUnderlay={() => setIsPressed(false)}>
      <View style={styles.contentWrapper}>
        {icon}
        {title && (
          <RegularText style={{ ...styles.text, ...textStyle }}>
            {title}
          </RegularText>
        )}
      </View>
    </BaseButton>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // vertical align
    alignSelf: 'center', // horizontal align
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
})
