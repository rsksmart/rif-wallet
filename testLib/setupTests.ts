import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

jest.mock('@rsksmart/rns-resolver.js')
// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup'

jest.mock('react-native-device-info', () => mockRNDeviceInfo)
