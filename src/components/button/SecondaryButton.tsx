import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from '../../styles'
import BaseButton, { BaseButtonInterface } from './BaseButton'

type SecondaryButtonType = {
  children: React.ReactNode
  style?: object
}
const SecondaryButton: React.FC<BaseButtonInterface & SecondaryButtonType> = ({
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
    backgroundColor: colors.background.light,
    paddingVertical: 15,
    marginHorizontal: 10,
    width: 150,
    alignItems: 'center',
    borderWidth: 1,
  },
})

export default SecondaryButton
