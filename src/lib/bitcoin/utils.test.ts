import { isBitcoinAddressValid } from './utils'
import { addressesOrganized } from './bitcoinMock'

function testAddresses(
  addresses: string[],
  shouldBeValid: boolean,
  expect: jest.Expect,
) {
  for (const address of addresses) {
    expect(isBitcoinAddressValid(address)).toEqual(shouldBeValid)
  }
}
describe('Utils', () => {
  describe('isBitcoinAddressValid', () => {
    const { BIP84, BIP44 } = addressesOrganized
    it('Should return true (VALID) for the bitcoin mainnet BIP84 addresses array mock', () => {
      testAddresses(BIP84.mainnet.valid, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin mainnet BIP84 addresses array mock', () => {
      testAddresses(BIP84.mainnet.invalid, false, expect)
    })

    it('Should return true (VALID) for the bitcoin testnet BIP84 addresses array mock', () => {
      testAddresses(BIP84.testnet.valid, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin testnet BIP84 addresses array mock', () => {
      testAddresses(BIP84.testnet.invalid, false, expect)
    })

    /**
     * BIP 44 Tests
     */

    it('Should return true (VALID) for the bitcoin mainnet BIP44 addresses array mock', () => {
      testAddresses(BIP44.mainnet.valid, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin mainnet BIP44 addresses array mock', () => {
      testAddresses(BIP44.mainnet.invalid, false, expect)
    })

    it('Should return true (VALID) for the bitcoin testnet BIP44 addresses array mock', () => {
      testAddresses(BIP44.testnet.valid, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin testnet BIP44 addresses array mock', () => {
      testAddresses(BIP44.testnet.invalid, false, expect)
    })
  })
})
