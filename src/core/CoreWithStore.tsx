import { store, Provider } from 'store/index'
import { Core } from './Core'

export const CoreWithStore = () => (
  <Provider store={store}>
    <Core />
  </Provider>
)
