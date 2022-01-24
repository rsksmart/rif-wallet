import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { AddressInput } from '.'
import { testnetCase } from './testCase'
import { act } from 'react-test-renderer'

const testId = 'Input.Address'

/*
// WORKS!
jest.mock('../../core/setup', () => ({
  __esModule: true, // this property makes it work
  setup: 'setup',
  namedExport: jest.fn(),
  rnsResolver: () => ({
    addr: jest.fn(() => Promise.resolve('0x000_MOCK_DOMAIN_ADDRESS')),
  }),
}))

jest.mock('../../core/setup', () => ({
  rnsResolver: () => ({
    addr: jest.fn(() => Promise.resolve('0x000_MOCK_DOMAIN_ADDRESS')),
  }),
}))

*/

jest.mock('@rsksmart/rns-resolver.js', () => ({
  forRskTestnet: () => ({
    addr: jest.fn(() => Promise.resolve('0x000_MOCK_DOMAIN_ADDRESS')),
  }),
}))

const WrappedAddressInput = ({ handleChange }: any) => {
  const [address, setAddress] = useState('')

  return (
    <AddressInput
      testID={testId}
      initialValue={address}
      onChangeText={newAddress => {
        handleChange(newAddress)
        setAddress(newAddress)
      }}
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
    test('empty', () => {
      const { handleChange, input } = createInstance()

      fireEvent.changeText(input, testnetCase.invalid)
      expect(handleChange).toHaveBeenCalledWith(testnetCase.invalid)
    })

    test('wrong checksum', () => {
      const { handleChange, input, getByTestId } = createInstance()

      fireEvent.changeText(input, testnetCase.wrongChecksum)

      expect(handleChange).toHaveBeenCalledWith(testnetCase.wrongChecksum)
      expect(getByTestId('Input.Address.InputInfo').children[0]).toBe(
        'The checksum is invalid.',
      )

      fireEvent.press(getByTestId('Input.Address.Button.Checksum'))
      expect(handleChange).toHaveBeenCalledWith(testnetCase.checksummed)
    })
  })

  describe('valid cases', () => {
    test('valid', () => {
      const { handleChange, input } = createInstance()

      fireEvent.changeText(input, testnetCase.checksummed)

      expect(handleChange).toHaveBeenCalledWith(testnetCase.checksummed)
    })

    test('lower', () => {
      const { handleChange, input } = createInstance()

      fireEvent.changeText(input, testnetCase.lower)

      expect(handleChange).toHaveBeenCalledWith(testnetCase.lower)
    })

    test('rns', async () => {
      const { getByTestId, input } = createInstance()

      await act(async () => {
        await fireEvent.changeText(input, 'testing.rsk')
      })

      expect(getByTestId('Input.Address.InputInfo').children[0]).toBe(
        'Resolved: testing.rsk',
      )
    })
  })
})
