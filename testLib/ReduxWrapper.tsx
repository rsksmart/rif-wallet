import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store/store'

export const ReduxWrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
)
