import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { store, persistor } from 'store/store'

import { Core } from './Core'

export const CoreWithStore = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Core />
    </PersistGate>
  </Provider>
)
