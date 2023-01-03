jest.mock('@rsksmart/rns-resolver.js')
// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup'

// mock NativeEventEmitter for the RAMP SDK
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
