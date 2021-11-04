import './shim'
import '@ethersproject/shims' // ref: https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative
import 'react-native-gesture-handler'
import 'react-native-get-random-values'

import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView, StatusBar, View, AppState, Text } from 'react-native'

import { Wallets, Requests } from './Context'
import { RootNavigation } from './RootNavigation'
import ModalComponent from './ux/requestsModal/ModalComponent'

import { Wallet } from '@ethersproject/wallet'
import { KeyManagementSystem, OnRequest, RIFWallet } from './lib/core'
import { getKeys, hasKeys, saveKeys, deleteKeys } from './storage/KeyStore'
import { jsonRpcProvider } from './lib/jsonRpcProvider'

import { Paragraph } from './components/typography'
import { AppContext } from './Context'
import { RifWalletServicesFetcher } from './lib/rifWalletServices/RifWalletServicesFetcher'
import { AbiEnhancer } from './lib/abiEnhancer/AbiEnhancer'

const createRIFWalletFactory = (onRequest: OnRequest) => (wallet: Wallet) =>
  RIFWallet.create(
    wallet.connect(jsonRpcProvider),
    '0x3f71ce7bd7912bf3b362fd76dd34fa2f017b6388',
    onRequest,
  ) // temp - using only testnet

const fetcher = new RifWalletServicesFetcher()
const abiEnhancer = new AbiEnhancer()

const App = () => {
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState
      setAppStateVisible(nextAppState)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const [ready, setReady] = useState(false)

  const [kms, setKMS] = useState<null | KeyManagementSystem>(null)
  const [wallets, setWallets] = useState<Wallets>({})
  const [requests, setRequests] = useState<Requests>([])
  const [selectedWallet, setSelectedWallet] = useState('')

  const onRequest: OnRequest = request => setRequests([request])
  const createRIFWallet = createRIFWalletFactory(onRequest)

  const setKeys = (newKms: KeyManagementSystem, newWallets: Wallets) => {
    setWallets(newWallets)
    setSelectedWallet(newWallets[Object.keys(newWallets)[0]].address) // temp - using only one wallet
    setKMS(newKms)
  }

  const init = async () => {
    if (await hasKeys()) {
      const serializedKeys = await getKeys()
      // eslint-disable-next-line no-shadow
      const { kms, wallets } = KeyManagementSystem.fromSerialized(
        serializedKeys!,
      )

      const rifWallets = await Promise.all(wallets.map(createRIFWallet))

      const rifWalletsDictionary = rifWallets.reduce(
        (p: Wallets, c: RIFWallet) => Object.assign(p, { [c.address]: c }),
        {},
      )

      setKeys(kms, rifWalletsDictionary)
    }

    setReady(true)
  }

  useEffect(() => {
    init()
  }, [])

  if (!ready) {
    return (
      <>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ paddingVertical: 200 }}>
          <Paragraph>Getting set...</Paragraph>
        </View>
      </>
    )
  }

  const createFirstWallet = async (mnemonic: string) => {
    // eslint-disable-next-line no-shadow
    const kms = KeyManagementSystem.import(mnemonic)
    const { save, wallet } = kms.nextWallet(31)

    const rifWallet = await createRIFWallet(wallet)

    save()
    const serialized = kms.serialize()
    await saveKeys(serialized)

    setKeys(kms, { [rifWallet.address]: rifWallet })

    return rifWallet
  }

  const closeRequest = () => setRequests([] as Requests)

  return (
    <SafeAreaView>
      <StatusBar />

      <AppContext.Provider
        value={{
          wallets,
          selectedWallet,
          setRequests,
          mnemonic: kms?.mnemonic,
        }}>
        {appStateVisible === 'active' ? (
          <RootNavigation
            keyManagementProps={{
              generateMnemonic: () => KeyManagementSystem.create().mnemonic,
              createFirstWallet,
            }}
            balancesScreenProps={{ fetcher }}
            activityScreenProps={{ fetcher, abiEnhancer }}
            keysInfoScreenProps={{
              mnemonic: kms?.mnemonic || '',
              deleteKeys,
            }}
          />
        ) : (
          <Text>
            Current state is: {appStateVisible}
            {'Content Hidden'}
          </Text>
        )}
      </AppContext.Provider>

      {requests.length !== 0 && (
        <ModalComponent closeModal={closeRequest} request={requests[0]} />
      )}
    </SafeAreaView>
  )
}

export default App
