import React from 'react'
import { store, Provider } from './../redux'
import { Core } from './Core'

export const CoreWithStore = () => (
  <Provider store={store}>
    <Core />
  </Provider>
)
