import './shim'
import '@ethersproject/shims' // ref: https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative
import 'react-native-gesture-handler'
import 'react-native-get-random-values'

import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

import { Wallets, Requests, WalletsIsDeployed } from './Context'
import { RootNavigation } from './RootNavigation'
import ModalComponent from './ux/requestsModal/ModalComponent'

import { Wallet } from '@ethersproject/wallet'
import { KeyManagementSystem, OnRequest, RIFWallet } from './lib/core'
import { getKeys, saveKeys, deleteKeys } from './storage/KeyStore'
import { jsonRpcProvider } from './lib/jsonRpcProvider'
import { i18nInit } from './lib/i18n'
import { Loading } from './components'
import { AppContext } from './Context'
import { RifWalletServicesFetcher } from './lib/rifWalletServices/RifWalletServicesFetcher'
import { AbiEnhancer } from './lib/abiEnhancer/AbiEnhancer'
import Resolver from '@rsksmart/rns-resolver.js'

import { Cover } from './components/cover'
import { RequestPIN } from './components/requestPin'
import BackgroundStateManager, {
  AvailableStates,
} from './backgroundStateManager'

const createRIFWalletFactory = (onRequest: OnRequest) => (wallet: Wallet) =>
  RIFWallet.create(
    wallet.connect(jsonRpcProvider),
    '0x3f71ce7bd7912bf3b362fd76dd34fa2f017b6388',
    onRequest,
  ) // temp - using only testnet

const rifWalletServicesUrl = 'http://localhost:3000' // 'https://rif-wallet-services-dev.rifcomputing.net'

const fetcher = new RifWalletServicesFetcher(rifWalletServicesUrl)
const abiEnhancer = new AbiEnhancer()
// @ts-ignore
const rnsResolver = new Resolver.forRskTestnet()

const App = () => {
  const [appState, setAppState] = useState<AvailableStates>(
    AvailableStates.LOADING,
  )

  const [kms, setKMS] = useState<null | KeyManagementSystem>(null)
  const [wallets, setWallets] = useState<Wallets>({})
  const [walletsIsDeployed, setWalletsIsDeployed] = useState<WalletsIsDeployed>(
    {},
  )
  const [requests, setRequests] = useState<Requests>([])
  const [selectedWallet, setSelectedWallet] = useState('')

  const onRequest: OnRequest = request => setRequests([request])
  const createRIFWallet = createRIFWalletFactory(onRequest)

  const setKeys = (
    newKms: KeyManagementSystem,
    newWallets: Wallets,
    newWalletsIsDeployed: WalletsIsDeployed,
  ) => {
    setWallets(newWallets)
    setWalletsIsDeployed(newWalletsIsDeployed)
    setSelectedWallet(newWallets[Object.keys(newWallets)[0]].address) // temp - using only one wallet
    setKMS(newKms)
  }

  useEffect(() => {
    i18nInit()

    const backgroundState = new BackgroundStateManager(
      setAppState,
      loadExistingWallets,
      resetAppState,
    )

    backgroundState.appIsActive()

    return () => {
      backgroundState.removeSubscription()
    }
  }, [])

  const loadExistingWallets = async () => {
    const serializedKeys = await getKeys()
    // eslint-disable-next-line no-shadow
    const { kms, wallets } = KeyManagementSystem.fromSerialized(serializedKeys!)

    const rifWallets = await Promise.all(wallets.map(createRIFWallet))
    const isDeployedWallets = await Promise.all(
      rifWallets.map(w => w.smartWalletFactory.isDeployed()),
    )

    const rifWalletsDictionary = rifWallets.reduce(
      (p: Wallets, c: RIFWallet) => Object.assign(p, { [c.address]: c }),
      {},
    )

    const rifWalletsIsDeployedDictionary = rifWallets.reduce(
      (p: Wallets, c: RIFWallet, ci: number) =>
        Object.assign(p, { [c.address]: isDeployedWallets[ci] }),
      {},
    )

    setKeys(kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary)
    setAppState(AvailableStates.READY)
  }

  const createFirstWallet = async (mnemonic: string) => {
    // eslint-disable-next-line no-shadow
    const kms = KeyManagementSystem.import(mnemonic)
    const { save, wallet } = kms.nextWallet(31)

    const rifWallet = await createRIFWallet(wallet)
    const rifWalletIsDeployed = await rifWallet.smartWalletFactory.isDeployed()

    save()
    const serialized = kms.serialize()
    await saveKeys(serialized)

    setKeys(
      kms,
      { [rifWallet.address]: rifWallet },
      { [rifWallet.address]: rifWalletIsDeployed },
    )

    setAppState(AvailableStates.READY)
    return rifWallet
  }

  const resetAppState = () => {
    setKMS(null)
    setWallets({})
    setSelectedWallet('')
  }

  const closeRequest = () => setRequests([] as Requests)

  if (appState === AvailableStates.LOADING) {
    return (
      <SafeAreaView>
        <Loading reason="Getting set..." />
      </SafeAreaView>
    )
  }

  if (
    appState === AvailableStates.BACKGROUND ||
    appState === AvailableStates.BACKGROUND_LOCKED
  ) {
    return <Cover />
  }

  if (appState === AvailableStates.LOCKED) {
    return (
      <SafeAreaView>
        <RequestPIN unlock={loadExistingWallets} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <AppContext.Provider
        value={{
          wallets,
          walletsIsDeployed,
          selectedWallet,
          setRequests,
          mnemonic: kms?.mnemonic,
        }}>
        <RootNavigation
          keyManagementProps={{
            generateMnemonic: () => KeyManagementSystem.create().mnemonic,
            createFirstWallet,
          }}
          balancesScreenProps={{ fetcher }}
          sendScreenProps={{ rnsResolver }}
          activityScreenProps={{ fetcher, abiEnhancer }}
          keysInfoScreenProps={{
            mnemonic: kms?.mnemonic || '',
            deleteKeys,
          }}
        />

        {requests.length !== 0 && (
          <ModalComponent closeModal={closeRequest} request={requests[0]} />
        )}
      </AppContext.Provider>
    </SafeAreaView>
  )
}

export default App
