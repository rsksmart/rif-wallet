import { GlobalErrorHandler } from '../components/GlobalErrorHandler'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { CoreWithStore } from './CoreWithStore'
import React from 'react'

export const CoreGlobalErrorHandler = () => (
  <GlobalErrorHandler>
    <ErrorBoundary>
      <CoreWithStore />
    </ErrorBoundary>
  </GlobalErrorHandler>
)
