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
import { SafeAreaView, StatusBar, ScrollView } from 'react-native'
import 'react-native-gesture-handler'

// nodify
import 'react-native-get-random-values'
import './shim'

import RootNavigation from './src/RootNavigation'

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar />
      <RootNavigation />
    </SafeAreaView>
  )
}

export default App
