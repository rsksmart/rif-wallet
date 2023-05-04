import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Platform } from 'react-native'

import { GlobalErrorHandler } from '../components/GlobalErrorHandler'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { CoreWithStore } from './CoreWithStore'
import { useAppState } from './hooks/useAppState'

export const CoreGlobalErrorHandler = ({ CoreComponent = CoreWithStore }) => {
  const { appState } = useAppState()

  // Hide app when it's in background or inactive state
  // For Android we must set FLAG_SECURE in MainActivity
  // For iOS we must not render the CoreComponent (or build a custom screen)
  const isNotActive = ['background', 'inactive'].includes(appState)
  const hideApp = Platform.OS === 'ios' && isNotActive

  return (
    <GlobalErrorHandler>
      <ErrorBoundary>
        <SafeAreaProvider>
          {hideApp ? null : <CoreComponent />}
        </SafeAreaProvider>
      </ErrorBoundary>
    </GlobalErrorHandler>
  )
}
