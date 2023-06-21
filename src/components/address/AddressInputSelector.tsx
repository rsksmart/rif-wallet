import { TokenBalanceObject } from 'store/slices/balancesSlice/types'
import { ChainTypesByIdType } from 'shared/constants/chainConstants'

import { AddressInput, AddressInputProps } from './AddressInput'
import { AddressBitcoinInput } from './AddressBitcoinInput'

interface AddressInputSelectorProps extends AddressInputProps {
  token: TokenBalanceObject
  chainId: ChainTypesByIdType
  onChangeAddress: (
    newValue: string,
    newDisplayValue: string,
    isValid: boolean,
  ) => void
}

/**
 * Returns either AddressInput for Bitcoin or for RSK Flow based on a prop "isBitcoin" in the token
 * @param token
 * @param label
 * @param placeholder
 * @param value
 * @param inputName
 * @param onChangeAddress
 * @param resetValue
 * @param testID
 * @param chainId
 * @constructor
 */
export const AddressInputSelector = ({
  token = {} as TokenBalanceObject,
  label,
  placeholder,
  value,
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
        initialValue={value.address}
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
        value={value}
        onChangeAddress={onChangeAddress}
        resetValue={resetValue}
        chainId={chainId}
        testID={testID}
      />
    )
  }
}
