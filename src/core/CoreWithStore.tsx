import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { createNewStore } from 'store/store'

import { Core } from './Core'

export const CoreWithStore = () => {
  const { store, persistor } = createNewStore()

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Core />
      </PersistGate>
    </Provider>
  )
}
