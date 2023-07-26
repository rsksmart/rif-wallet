import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo)
