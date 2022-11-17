import { useState } from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { AddressInput } from './AddressInput'
import { testnetCase } from './testCase'
import { act } from 'react-test-renderer'

const testId = 'Input.Address'

jest.mock('@rsksmart/rns-resolver.js', () => ({
  forRskTestnet: () => ({
    addr: jest.fn(() => Promise.resolve('0x000_MOCK_DOMAIN_ADDRESS')),
  }),
}))

const WrappedAddressInput = ({ handleChange }: any) => {
  const [address, setAddress] = useState('')

  const onChangeText = (newAddress: string, isValid: boolean) => {
    handleChange(newAddress, isValid)
    setAddress(newAddress)
  }

  return (
    <AddressInput
      testID={testId}
      initialValue={address}
      onChangeText={onChangeText}
      chainId={31}
    />
  )
}

const createInstance = () => {
  const handleChange = jest.fn()
  const { getByTestId, findByTestId } = render(
    <WrappedAddressInput handleChange={handleChange} />,
  )
  const input = getByTestId(testId)

  return {
    handleChange,
    input,
    findByTestId,
    getByTestId,
  }
}

describe('address input', () => {
  describe('invalid cases', () => {
    test('invlid address', () => {
      const { handleChange, input } = createInstance()

      fireEvent.changeText(input, testnetCase.invalid)
      expect(handleChange).toHaveBeenCalledWith(testnetCase.invalid, false)
    })

    test('wrong checksum', () => {
      const { handleChange, input, getByTestId } = createInstance()

      fireEvent.changeText(input, testnetCase.wrongChecksum)

      expect(handleChange).toHaveBeenCalledWith(
        testnetCase.wrongChecksum,
        false,
      )
      expect(getByTestId('Input.Address.InputInfo').children[0]).toBe(
        'The checksum is invalid.',
      )

      fireEvent.press(getByTestId('Input.Address.Button.Checksum'))
      expect(handleChange).toHaveBeenCalledWith(testnetCase.checksummed, true)
    })

    it('empty', () => {
      const { handleChange, input } = createInstance()

      fireEvent.changeText(input, '1')
      fireEvent.changeText(input, '')

      expect(handleChange).toHaveBeenCalledWith('', false)
    })
  })

  describe('valid cases', () => {
    test('valid', () => {
      const { handleChange, input } = createInstance()

      fireEvent.changeText(input, testnetCase.checksummed)

      expect(handleChange).toHaveBeenCalledWith(testnetCase.checksummed, true)
    })

    test('lower', () => {
      const { handleChange, input } = createInstance()

      fireEvent.changeText(input, testnetCase.lower)

      expect(handleChange).toHaveBeenCalledWith(testnetCase.lower, true)
    })

    test('rns', async () => {
      const { getByTestId, input, handleChange } = createInstance()

      await act(async () => {
        await fireEvent.changeText(input, 'testing.rsk')
      })

      expect(getByTestId('Input.Address.InputInfo').children[0]).toBe(
        'RNS domain associated with this address',
      )

      expect(handleChange).toBeCalledWith('0x000_MOCK_DOMAIN_ADDRESS', false)
    })
  })
})
