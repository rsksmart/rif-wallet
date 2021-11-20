import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { AddressInput } from '.'
import { testnetCase } from './testCase'
import { AddressValidationMessage } from './lib'

const testId = 'Input.Address'

const WrappedAddressInput = ({ handleChange }: any) => {
  const [address, setAddress] = useState('')
  return (
    <AddressInput
      placeholder="To"
      testID={testId}
      value={address}
      onChangeText={(isValid, newAddress) => {
        handleChange(isValid, newAddress)
        setAddress(newAddress)
      }}
    />
  )
}

const createInstance = () => {
  const handleChange = jest.fn()
  const { getByTestId } = render(
    <WrappedAddressInput handleChange={handleChange} />,
  )
  const input = getByTestId(testId)
  const validationMessageText = getByTestId(testId + '.ValidationMessage')

  const getChecksumHandle = () => getByTestId(testId + '.ToChecksumHandle')

  return {
    handleChange,
    input,
    validationMessageText,
    getChecksumHandle,
  }
}

describe('address input', () => {
  describe('invalid cases', () => {
    test('empty', () => {
      const { handleChange, input, validationMessageText, getChecksumHandle } =
        createInstance()

      fireEvent.changeText(input, testnetCase.invalid)

      expect(handleChange).toHaveBeenCalledWith(false, testnetCase.invalid)
      expect(validationMessageText.children[0]).toEqual(
        AddressValidationMessage.INVALID_ADDRESS,
      )
      expect(() => getChecksumHandle()).toThrow()
    })

    test('wrong checksum', () => {
      const { handleChange, input, validationMessageText, getChecksumHandle } =
        createInstance()

      fireEvent.changeText(input, testnetCase.wrongChecksum)

      expect(handleChange).toHaveBeenCalledWith(
        false,
        testnetCase.wrongChecksum,
      )
      expect(validationMessageText.children[0]).toEqual(
        AddressValidationMessage.INVALID_CHECKSUM,
      )
      expect(getChecksumHandle()).toBeDefined()
    })
  })

  describe('valid cases', () => {
    test('valid', () => {
      const { handleChange, input, validationMessageText, getChecksumHandle } =
        createInstance()

      fireEvent.changeText(input, testnetCase.checksummed)

      expect(handleChange).toHaveBeenCalledWith(true, testnetCase.checksummed)
      expect(validationMessageText.children[0]).toEqual(
        AddressValidationMessage.VALID,
      )
      expect(() => getChecksumHandle()).toThrow()
    })

    test('lower', () => {
      const { handleChange, input, validationMessageText, getChecksumHandle } =
        createInstance()

      fireEvent.changeText(input, testnetCase.lower)

      expect(handleChange).toHaveBeenCalledWith(true, testnetCase.lower)
      expect(validationMessageText.children[0]).toEqual(
        AddressValidationMessage.VALID,
      )
      expect(() => getChecksumHandle()).toThrow()
    })

    test('after converting', () => {
      const { handleChange, input, validationMessageText, getChecksumHandle } =
        createInstance()

      fireEvent.changeText(input, testnetCase.wrongChecksum)
      fireEvent.press(getChecksumHandle())

      expect(handleChange.mock.calls[1]).toEqual([
        true,
        testnetCase.checksummed,
      ])
      expect(validationMessageText.children[0]).toEqual(
        AddressValidationMessage.VALID,
      )
      expect(() => getChecksumHandle()).toThrow()
    })
  })
})
