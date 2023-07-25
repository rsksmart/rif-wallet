import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Magic } from '@magic-sdk/react-native-bare'
import { Config } from 'react-native-config'

import { GlobalErrorHandler } from '../components/GlobalErrorHandler'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { CoreWithStore } from './CoreWithStore'

export const magic = new Magic(Config.MAGIC_KEY)

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
