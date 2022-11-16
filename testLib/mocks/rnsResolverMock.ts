import Resolver from '@rsksmart/rns-resolver.js'

// @ts-ignore
export const createMockRnsResolver = (): Resolver => ({
  addr: jest.fn(() => Promise.resolve('0x000_MOCK_DOMAIN_ADDRESS')),
})
