import { Provider, store } from 'store/index'
import { ReactNode } from 'react'

export const ReduxWrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
)
