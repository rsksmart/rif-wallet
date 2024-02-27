import { Component } from 'react'
import { NativeModules as RNNativeModules } from 'react-native'
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js'
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'
// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup'

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native') // use original implementation, which comes with mocks out of the box

  RN.NativeModules.JailMonkey = jest.requireActual('jail-monkey')

  return RN
})

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard)

jest.mock('react-native-device-info', () => mockRNDeviceInfo)

RNNativeModules.CameraView = {
  getConstants: jest.fn(),
}

jest.mock('react-native-vision-camera', () => {
  return {
    useCameraDevice: jest.fn(() => {}),
    useCodeScanner: jest.fn(() => {}),
  }
})

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

jest.mock('react-native-screenshot-prevent', () => ({
  addListener: jest.fn(),
  enabled: jest.fn(),
  enableSecureView: jest.fn(),
  disableSecureView: jest.fn(),
}))
