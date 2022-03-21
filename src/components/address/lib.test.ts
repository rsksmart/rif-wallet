import { AddressValidationMessage, validateAddress } from './lib'
import { testnetCase } from './testCase'

describe('validate address', () => {
  describe('testnet', () => {
    test('invalid address', () =>
      expect(validateAddress(testnetCase.invalid, 31)).toEqual(
        AddressValidationMessage.INVALID_ADDRESS,
      ))
    test('valid lowercase address', () =>
      expect(validateAddress(testnetCase.checksummed, 31)).toEqual(
        AddressValidationMessage.VALID,
      ))
    test('valid checksummed address', () =>
      expect(validateAddress(testnetCase.lower, 31)).toEqual(
        AddressValidationMessage.VALID,
      ))
    test('invalid checksummed address', () =>
      expect(validateAddress(testnetCase.wrongChecksum, 31)).toEqual(
        AddressValidationMessage.INVALID_CHECKSUM,
      ))
    test('empty address', () =>
      expect(validateAddress('', 31)).toEqual(
        AddressValidationMessage.INVALID_ADDRESS,
      ))
  })
})
