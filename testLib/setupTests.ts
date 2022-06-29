/* eslint-disable no-undef */
// Mock rn-secure-storage so that jest will not go looking for it.

jest.mock('rn-secure-storage', () => {})
jest.mock('@rsksmart/rns-resolver.js')

jest.mock('@rsksmart/relaying-services-sdk', () => {})