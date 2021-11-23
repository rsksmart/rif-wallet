import Resolver from '@rsksmart/rns-resolver.js'

// @ts-ignore
export const createMockRnsResolver = (): Resolver => ({
  // eslint-disable-next-line no-undef
  addr: jest.fn(() => Promise.resolve('0x000_MOCK_DOMAIN_ADDRESS')),
})
