import { SafeAreaProvider } from 'react-native-safe-area-context'
import FlashMessage from 'react-native-flash-message'
import { Magic } from '@magic-sdk/react-native-bare'
import Config from 'react-native-config'

import { getCurrentChainId } from 'src/storage/ChainStorage'

import { GlobalErrorHandler } from '../components/GlobalErrorHandler'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { CoreWithStore } from './CoreWithStore'
import { getWalletSetting } from './config'
import { SETTINGS } from './types'

export const magic = new Magic(Config.MAGIC_API_KEY, {
  network: {
    rpcUrl: getWalletSetting(SETTINGS.RPC_URL, getCurrentChainId()),
    chainId: getCurrentChainId(),
  },
})

export const CoreGlobalErrorHandler = ({ CoreComponent = CoreWithStore }) => {
  return (
    <GlobalErrorHandler>
      <ErrorBoundary>
        <SafeAreaProvider>
          <CoreComponent />
          <magic.Relayer />
        </SafeAreaProvider>
      </ErrorBoundary>
      <FlashMessage />
    </GlobalErrorHandler>
  )
}
