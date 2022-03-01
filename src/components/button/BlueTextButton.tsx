import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { colors } from '../../styles/colors'
import BaseButton, { ButtonInterface, textSharedStyles } from './BaseButton'

const BlueTextButton: React.FC<ButtonInterface> = ({
  title,
  disabled,
  ...props
}) => {
  return (
    <BaseButton
      {...props}
      variantStyle={disabled ? styles.blueVariantDisabled : styles.blueVariant}
      underlayColor={
        disabled ? styles.blueVariantDisabled.backgroundColor : '#7f77fa'
      }>
      <Text
        style={
          disabled
            ? { ...textSharedStyles.text, ...styles.textDisabled }
            : { ...textSharedStyles.text, ...styles.text }
        }>
        {title}
      </Text>
    </BaseButton>
  )
}

const styles = StyleSheet.create({
  blueVariant: {
    backgroundColor: colors.blue,
  },
  blueVariantDisabled: {
    backgroundColor: '#251e79',
  },
  text: {
    color: colors.lightPurple,
  },
  textDisabled: {
    color: '#7e7eb8',
  },
})

export default BlueTextButton
