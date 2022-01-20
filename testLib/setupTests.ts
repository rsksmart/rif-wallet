// import fetch from 'node-fetch'

// global.fetch = fetch as any

// Mock rn-secure-storage so that jest will not go looking for it.
// eslint-disable-next-line no-undef
jest.mock('rn-secure-storage', () => {})
