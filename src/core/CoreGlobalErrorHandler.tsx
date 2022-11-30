import { GlobalErrorHandler } from '../components/GlobalErrorHandler'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { CoreWithStore } from './CoreWithStore'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export const CoreGlobalErrorHandler = ({ CoreComponent = CoreWithStore }) => (
  <GlobalErrorHandler>
    <ErrorBoundary>
      <SafeAreaProvider>
        <CoreComponent />
      </SafeAreaProvider>
    </ErrorBoundary>
  </GlobalErrorHandler>
)
