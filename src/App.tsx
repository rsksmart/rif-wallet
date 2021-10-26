import './shim'
import '@ethersproject/shims' // ref: https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative
import 'react-native-gesture-handler'
import 'react-native-get-random-values'

import React, { createContext, useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'

import { WalletProviderElement } from './state/AppContext'
import RootNavigation from './RootNavigation'

import { KeyManagementSystem, OnRequest, RIFWallet, Request } from "./lib/core"
import { SWalletContext, Wallets, Requests, useSelectedWallet } from './Context'
import { getKeys } from "./storage/KeyStore"
import { jsonRpcProvider } from './lib/jsonRpcProvider'
import { Paragraph } from './components/typography'


const App = () => {
  const [kms, setKMS] = useState<null | KeyManagementSystem>(null)
  const [wallets, setWallets] = useState<Wallets>({})
  const [requests, setRequests] = useState<Requests>([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [ready, setReady] = useState(false)

  const onRequest: OnRequest = request => setRequests([request])

  const init = async () => {
    const serializedKeys = await getKeys()
    if (serializedKeys) {
      const { kms, wallets } = KeyManagementSystem.fromSerialized(serializedKeys)
      setKMS(kms)

      const rifWallets = await Promise.all(wallets.map(
        wallet => RIFWallet.create(wallet.connect(jsonRpcProvider), '0x3f71ce7bd7912bf3b362fd76dd34fa2f017b6388', onRequest) // temp - using only testnet
      ))

      const rifWalletsDictionary = rifWallets.reduce((p: Wallets, c: RIFWallet) => Object.assign(p, { [c.address]: c }), {})

      setWallets(rifWalletsDictionary)
      setSelectedWallet(rifWallets[0].address) // temp - using only one wallet
      setReady(true)
    }
  }

  useEffect(() => {
    init()
  }, [])

  if (!ready) return <View style={{paddingVertical:200}}><Paragraph>Getting set...</Paragraph></View>

  return (
    <SWalletContext.Provider value={{ wallets, selectedWallet, requests, setRequests }}>
      <SafeAreaView>
        <WalletProviderElement>
          <StatusBar />
          <RootNavigation />
        </WalletProviderElement>
      </SafeAreaView>
    </SWalletContext.Provider>
  )
}

export default App
