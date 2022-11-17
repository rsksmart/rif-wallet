import { Component } from 'react'
import GlobalErrorHandlerView from '../GlobalErrorHandler/GlobalErrorHandlerView'

interface IErrorBoundaryProps {
  [key: string]: any
}

interface IErrorBoundaryState {
  hasError: boolean
  message: string | undefined
}
class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false,
      message: undefined,
    }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: error.toString() }
  }

  componentDidCatch(error: Error) {
    console.log('Threw an error', error.toString())
  }

  render() {
    if (this.state.hasError) {
      return <GlobalErrorHandlerView message={this.state.message} />
    }
    return this.props.children
  }
}

export default ErrorBoundary
