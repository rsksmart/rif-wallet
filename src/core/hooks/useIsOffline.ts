import { useNetInfo } from '@react-native-community/netinfo'

export const useIsOffline = () => {
  const netInfo = useNetInfo()
  // ignore null values
  return netInfo.isConnected === false || netInfo.isInternetReachable === false
}
