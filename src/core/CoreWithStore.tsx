import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Magic } from '@magic-sdk/react-native-bare'

import { store, persistor } from 'store/store'

import { Core } from './Core'
import { SETTINGS, defaultChainId, getWalletSetting } from './config'

export const magic = new Magic('pk_live_6B2B61638674A129', {
  network: {
    chainId: Number(defaultChainId),
    rpcUrl: getWalletSetting(SETTINGS.RPC_URL),
  },
})

export const CoreWithStore = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <magic.Relayer />
      <Core />
    </PersistGate>
  </Provider>
)
