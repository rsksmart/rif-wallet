import { Provider, createStore } from 'store/index'
import { ReactNode } from 'react'

export const createReduxWrapper = (preloadedState = {}) => {
  const storeForTests = createStore(preloadedState)

  const ReduxWrapper = ({
    children,
  }: {
    store: ReturnType<typeof createStore>
    children: ReactNode
  }) => <Provider store={storeForTests}>{children}</Provider>

  return { storeForTests, ReduxWrapper }
}
