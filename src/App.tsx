import './shim'
import '@ethersproject/shims' // ref: https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative
import 'react-native-gesture-handler'
import 'react-native-get-random-values'

import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'

import { Wallets, Requests, AppContextProvider } from './Context'
import RootNavigation from './RootNavigation'
import ModalComponent from './modal/ModalComponent'

import { Wallet } from '@ethersproject/wallet'
import { KeyManagementSystem, OnRequest, RIFWallet } from "./lib/core"
import { getKeys, hasKeys, saveKeys } from "./storage/KeyStore"
import { jsonRpcProvider } from './lib/jsonRpcProvider'

import { Paragraph } from './components/typography'

const createRIFWalletFactory = (onRequest: OnRequest) => (wallet: Wallet) => RIFWallet.create(
  wallet.connect(jsonRpcProvider), '0x3f71ce7bd7912bf3b362fd76dd34fa2f017b6388', onRequest
) // temp - using only testnet

const App = () => {
  const [kms, setKMS] = useState<null | KeyManagementSystem>(null)
  const [wallets, setWallets] = useState<Wallets>({})
  const [requests, setRequests] = useState<Requests>([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [ready, setReady] = useState(false)

  const onRequest: OnRequest = request => setRequests([request])
  const createRIFWallet = createRIFWalletFactory(onRequest)

  const setKeys = (kms: KeyManagementSystem, wallets: Wallets) => {
    setWallets(wallets)
    setSelectedWallet(wallets[Object.keys(wallets)[0]].address) // temp - using only one wallet
    setKMS(kms)
  }

  const init = async () => {
    if (await hasKeys()) {
      const serializedKeys = await getKeys()
      const { kms, wallets } = KeyManagementSystem.fromSerialized(serializedKeys!)

      const rifWallets = await Promise.all(wallets.map(createRIFWallet))

      const rifWalletsDictionary = rifWallets.reduce((p: Wallets, c: RIFWallet) => Object.assign(p, { [c.address]: c }), {})

      setKeys(kms, rifWalletsDictionary)
    }

    setReady(true)
  }

  useEffect(() => {
    init()
  }, [])

  if (!ready) return <View style={{paddingVertical:200}}><Paragraph>Getting set...</Paragraph></View>

  const createFirstWallet = async (mnemonic: string) => {
    console.log('setting up new wallet')
    const kms = KeyManagementSystem.import(mnemonic)
    const { save, wallet } = kms.nextWallet(31)

    const rifWallet = await createRIFWallet(wallet)

    save()
    const serialized = kms.serialize()
    await saveKeys(serialized)

    setKeys(kms, { [rifWallet.address]: rifWallet })
  }

  const closeRequest = () => setRequests([] as Requests)

  console.log(kms?.mnemonic)

  return (
      <SafeAreaView>
        <StatusBar />
        <AppContextProvider value={{ hasKeys: !!kms, mnemonic: kms?.mnemonic, createFirstWallet, wallets, selectedWallet, setRequests }}>
          <RootNavigation />
        </AppContextProvider>
        {requests.length !== 0 && (
          <ModalComponent
            closeModal={closeRequest}
            request={requests[0]}
          />
        )}
      </SafeAreaView>
  )
}

export default App
