import { Platform } from 'react-native'

export const rifWalletServicesUrl =
  Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000' // 'https://rif-wallet-services.testnet.rifcomputing.net/'
