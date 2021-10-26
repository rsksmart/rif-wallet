import './shim'
import '@ethersproject/shims' // ref: https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative
import 'react-native-gesture-handler'
import 'react-native-get-random-values'

import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

import { WalletProviderElement } from './state/AppContext'
import RootNavigation from './RootNavigation'

const App = () => {
  return (
    <SafeAreaView>
      <WalletProviderElement>
        <StatusBar />
        <RootNavigation />
      </WalletProviderElement>
    </SafeAreaView>
  )
}

export default App
