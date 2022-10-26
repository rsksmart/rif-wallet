import { colors } from '../../styles'
import { AddressInput } from './AddressInput'
import React from 'react'
import { AddressBitcoinInput } from './AddressBitcoinInput'

export const AddressInputSelector: React.FC<{ [key: string]: any }> = ({
  token = {},
  initialValue,
  onChangeText,
  testID,
  chainId,
  backgroundColor = colors.darkPurple5,
}) => {
  if ('isBitcoin' in token) {
    return (
      <AddressBitcoinInput
        initialValue={initialValue}
        onChangeText={onChangeText}
        token={token}
      />
    )
  } else {
    return (
      <AddressInput
        initialValue={initialValue}
        onChangeText={onChangeText}
        chainId={chainId}
        testID={testID}
        backgroundColor={backgroundColor}
      />
    )
  }
}
