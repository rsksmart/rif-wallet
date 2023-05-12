import { TokenBalanceObject } from 'store/slices/balancesSlice/types'

import { AddressInput, AddressInputProps } from './AddressInput'
import { AddressBitcoinInput } from './AddressBitcoinInput'

interface AddressInputSelectorProps extends AddressInputProps {
  token: TokenBalanceObject
  chainId: number
  onChangeAddress: (newValue: string, isValid: boolean) => void
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
export const AddressInputSelector = ({
  token = {} as TokenBalanceObject,
  label,
  placeholder,
  initialValue,
  inputName,
  onChangeAddress,
  resetValue,
  testID,
  chainId,
}: AddressInputSelectorProps) => {
  if ('satoshis' in token) {
    return (
      <AddressBitcoinInput
        label={label}
        placeholder={placeholder}
        inputName={inputName}
        initialValue={initialValue}
        onChangeAddress={onChangeAddress}
        resetValue={resetValue}
        testID={'AddressBitcoinInput.Text'}
        chainId={chainId}
      />
    )
  } else {
    return (
      <AddressInput
        label={label}
        placeholder={placeholder}
        inputName={inputName}
        initialValue={initialValue}
        onChangeAddress={onChangeAddress}
        resetValue={resetValue}
        chainId={chainId}
        testID={testID}
      />
    )
  }
}
