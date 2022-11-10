import { isBitcoinAddressValid } from './utils'
import * as mocks from './bitcoinMock'

function testAddresses(
  addresses: string[],
  shouldBeValid: boolean,
  expect: jest.Expect,
) {
  for (const address of addresses) {
    console.log(address)
    expect(isBitcoinAddressValid(address)).toEqual(shouldBeValid)
  }
}
describe('Utils', () => {
  describe('isBitcoinAddressValid', () => {
    it('Should return true (VALID) for the bitcoin mainnet addresses array mock', () => {
      testAddresses(mocks.bitcoinValidMainnetAddresses, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin mainnet addresses array mock', () => {
      testAddresses(mocks.bitcoinInvalidMainnetAddresses, false, expect)
    })

    it('Should return true (VALID) for the bitcoin testnet addresses array mock', () => {
      testAddresses(mocks.bitcoinValidTestnetAddresses, true, expect)
    })

    it('Should return false (INVALID) for the bitcoin testnet addresses array mock', () => {
      testAddresses(mocks.bitcoinInvalidTestnetAddresses, false, expect)
    })
  })
})
