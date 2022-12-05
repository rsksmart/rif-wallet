import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from 'src/redux/store'
import { Provider, store } from 'store/index'
import { Core } from './Core'

export const CoreWithStore = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Core />
    </PersistGate>
  </Provider>
)
