import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from '../../styles'
import BaseButton, { BaseButtonInterface } from './BaseButton'

type PrimaryButtonType = {
  children: React.ReactNode
  style?: object
}
const PrimaryButton: React.FC<BaseButtonInterface & PrimaryButtonType> = ({
  children,
  style = {},
  ...props
}) => (
  <BaseButton style={{ ...styles.buttonStyle, ...style }} {...props}>
    {children}
  </BaseButton>
)

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 40,
    backgroundColor: colors.background.button,
    paddingVertical: 15,
    marginHorizontal: 10,
    width: 150,
    alignItems: 'center',
  },
})

export default PrimaryButton
