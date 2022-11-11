import { GlobalErrorHandler } from '../components/GlobalErrorHandler'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { CoreWithStore } from './CoreWithStore'
import React from 'react'

export const CoreGlobalErrorHandler = ({ CoreComponent = CoreWithStore }) => (
  <GlobalErrorHandler>
    <ErrorBoundary>
      <CoreComponent />
    </ErrorBoundary>
  </GlobalErrorHandler>
)
