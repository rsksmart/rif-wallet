import Resolver from '@rsksmart/rns-resolver.js'

export const createMockRnsResolver = (): Partial<Resolver> => ({
  addr: jest.fn(() => Promise.resolve('0x000_MOCK_DOMAIN_ADDRESS')),
})
