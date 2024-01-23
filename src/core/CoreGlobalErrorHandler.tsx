import { SafeAreaProvider } from 'react-native-safe-area-context'
import FlashMessage from 'react-native-flash-message'

import { GlobalErrorHandler } from '../components/GlobalErrorHandler'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { CoreWithStore } from './CoreWithStore'

export const CoreGlobalErrorHandler = ({ CoreComponent = CoreWithStore }) => {
  return (
    <GlobalErrorHandler>
      <ErrorBoundary>
        <SafeAreaProvider>
          <CoreComponent />
        </SafeAreaProvider>
      </ErrorBoundary>
      <FlashMessage />
    </GlobalErrorHandler>
  )
}
