import { colors } from '../../styles'
import { AddressInput } from './AddressInput'
import React from 'react'
import { AddressBitcoinInput } from './AddressBitcoinInput'
import { MixedTokenAndNetworkType } from '../../screens/send/types'

interface IAddressInputSelector {
  token: MixedTokenAndNetworkType
  initialValue: string
  onChangeText: (newValue: string, isValid: boolean) => void
  testID?: string
  chainId: number
  backgroundColor?: string
}

/**
 * Returns either AddressInput for Bitcoin or for RSK Flow based on a prop "isBitcoin" in the token
 * @param token
 * @param initialValue
 * @param onChangeText
 * @param testID
 * @param chainId
 * @param backgroundColor
 * @constructor
 */
export const AddressInputSelector: React.FC<IAddressInputSelector> = ({
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
