import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Magic } from '@magic-sdk/react-native-bare'
import { Config } from 'react-native-config'

import { ChainTypeEnum } from 'store/slices/settingsSlice/types'

import { GlobalErrorHandler } from '../components/GlobalErrorHandler'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { CoreWithStore } from './CoreWithStore'
import { getWalletSetting } from './config'
import { SETTINGS } from './types'

export const magic = new Magic(Config.MAGIC_KEY, {
  network: {
    rpcUrl: getWalletSetting(SETTINGS.RPC_URL, ChainTypeEnum.TESTNET),
    chainId: 31,
  },
})

export const CoreGlobalErrorHandler = ({ CoreComponent = CoreWithStore }) => {
  return (
    <GlobalErrorHandler>
      <magic.Relayer />
      <ErrorBoundary>
        <SafeAreaProvider>
          <CoreComponent />
        </SafeAreaProvider>
      </ErrorBoundary>
    </GlobalErrorHandler>
  )
}
