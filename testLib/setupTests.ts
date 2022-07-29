/* eslint-disable no-undef */
// Mock rn-secure-storage so that jest will not go looking for it.
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'

jest.mock('rn-secure-storage', () => {})
jest.mock('@rsksmart/rns-resolver.js')
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
