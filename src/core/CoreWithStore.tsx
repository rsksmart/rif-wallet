import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { createNewStore } from 'store/store'
import { WalletProvider } from 'shared/wallet'

import { Core } from './Core'

export const CoreWithStore = () => {
  const { store, persistor } = createNewStore()

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <WalletProvider>
          <Core />
        </WalletProvider>
      </PersistGate>
    </Provider>
  )
}
