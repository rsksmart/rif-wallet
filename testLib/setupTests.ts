import { Component } from 'react'
// eslint-disable-next-line import/order
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

jest.mock('@rsksmart/rns-resolver.js')
// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup'

jest.mock('react-native-device-info', () => mockRNDeviceInfo)

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: (props: { children: Component }) => props.children,
}))
jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistReducer: jest.fn().mockImplementation((config, reducer) => reducer),
}))

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(),
}))
