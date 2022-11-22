import { ErrorWithMessage } from '../types'

export const errorHandler = (error: unknown) => {
  if (typeof error === 'object' && Object.hasOwn(error as object, 'message')) {
    const err = error as ErrorWithMessage
    return err.message
  } else {
    return 'Unknown error occurred!'
  }
}
