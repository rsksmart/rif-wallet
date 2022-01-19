import { Platform } from 'react-native'

export const rifWalletServicesUrl =
  Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://127.0.0.1:3000' // 'https://rif-wallet-services.testnet.rifcomputing.net/'
