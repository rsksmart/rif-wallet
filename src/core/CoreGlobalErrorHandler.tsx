import { GlobalErrorHandler } from '../components/GlobalErrorHandler'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { CoreWithStore } from './CoreWithStore'

export const CoreGlobalErrorHandler = ({ CoreComponent = CoreWithStore }) => (
  <GlobalErrorHandler>
    <ErrorBoundary>
      <CoreComponent />
    </ErrorBoundary>
  </GlobalErrorHandler>
)
