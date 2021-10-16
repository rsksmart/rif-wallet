/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import 'react-native-gesture-handler'

// nodify
import 'react-native-get-random-values'
import './shim'
import '@ethersproject/shims' // ref: https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative

import RootNavigation from './src/RootNavigation'
import { WalletProviderElement } from './src/state/AppContext'

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
