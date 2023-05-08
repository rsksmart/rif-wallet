import { SafeAreaProvider } from 'react-native-safe-area-context'

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
    </GlobalErrorHandler>
  )
}
