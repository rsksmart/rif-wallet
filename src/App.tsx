import './shim'
import '@ethersproject/shims' // ref: https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative
import 'react-native-gesture-handler'
import 'react-native-get-random-values'

import React, { useEffect, useRef, useState } from 'react'
import { AppState, SafeAreaView, StatusBar } from 'react-native'

import { Wallets, Requests, WalletsIsDeployed } from './Context'
import { RootNavigation } from './RootNavigation'
import ModalComponent from './ux/requestsModal/ModalComponent'

import { Wallet } from '@ethersproject/wallet'
import { KeyManagementSystem, OnRequest, RIFWallet } from './lib/core'
import { getKeys, saveKeys, deleteKeys, hasKeys } from './storage/KeyStore'
import { jsonRpcProvider } from './lib/jsonRpcProvider'
import { i18nInit } from './lib/i18n'
import { LoadingScreen } from './components/loading/LoadingScreen'
import { AppContext } from './Context'
import { RifWalletServicesFetcher } from './lib/rifWalletServices/RifWalletServicesFetcher'
import { AbiEnhancer } from './lib/abiEnhancer/AbiEnhancer'
import Resolver from '@rsksmart/rns-resolver.js'

import { Cover } from './components/cover'
import { RequestPIN } from './components/requestPin'

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

// 1. check if user has creted the keys (hasKeys)
// user has no keys -> show "crate keys ux"
// 2. use swallet state to display screen
// - if !active => show the cover, otherwise
// - if !unlocked => show pin request screnn, otherwise
// - show app
// 3. load user keys:
//   a. get the keys
//   b. create the eoas
//   c. stablish rpc connection
//   d. connect to smart wallet
//   e. check if smart wallet is deployed

const gracePeriod = 3000

const loadExistingWallets = (createRIFWallet: ReturnType<typeof createRIFWalletFactory>) => async () => {
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

  return { kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary }
}

const creteKMS = (createRIFWallet: ReturnType<typeof createRIFWalletFactory>) => async (mnemonic: string) => {
  const kms = KeyManagementSystem.import(mnemonic)
  const { save, wallet } = kms.nextWallet(31)

  const rifWallet = await createRIFWallet(wallet)
  const rifWalletIsDeployed = await rifWallet.smartWalletFactory.isDeployed()

  save()
  const serialized = kms.serialize()
  await saveKeys(serialized)

  const rifWalletsDictionary = { [rifWallet.address]: rifWallet }
  const rifWalletsIsDeployedDictionary = { [rifWallet.address]: rifWalletIsDeployed }

  return { kms, rifWallet, rifWalletsDictionary, rifWalletsIsDeployedDictionary }
}

let timer: NodeJS.Timeout

const Wrapper: React.FC<{ removeKeys: () => void, appHasKeys: boolean, unlockApp: () => Promise<void> }> = ({ children, removeKeys, appHasKeys, unlockApp }) => {
  const [active, setActive] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>(timer)

  useEffect(() => {
    const stateSubscription = AppState.addEventListener('change', (state) => {
      const isNowActive = state === 'active'
      setActive(isNowActive)

      if (unlocked)
        if (!isNowActive) {
          const newTimer = setTimeout(() => {
            removeKeys()
            setUnlocked(false)
          }, gracePeriod)

          timerRef.current = newTimer
        } else {
          if (timerRef.current) {
            clearTimeout(timerRef.current)
          }
        }
    })

    return () => {
      stateSubscription.remove()
    }
  }, [unlocked])

  return <>
    {!active && <Cover />}
    {appHasKeys && !unlocked && <RequestPIN unlock={() => unlockApp().then(() => setUnlocked(true))} />}
    {children}
  </>
}

const App = () => {
  const [appHasKeys, setAppHasKeys] = useState(false)
  const [loading, setLoading] = useState(true)

  const [kms, setKMS] = useState<null | KeyManagementSystem>(null)
  const [wallets, setWallets] = useState<Wallets>({})
  const [walletsIsDeployed, setWalletsIsDeployed] = useState<WalletsIsDeployed>(
    {},
  )
  const [requests, setRequests] = useState<Requests>([])
  const [selectedWallet, setSelectedWallet] = useState('')

  const removeKeys = () => {
    setKMS(null)
    setWallets({})
    setWalletsIsDeployed({})
    setSelectedWallet('')
  }

  const setKeys = (
    newKms: KeyManagementSystem,
    newWallets: Wallets,
    newWalletsIsDeployed: WalletsIsDeployed,
  ) => {
    setKMS(newKms)
    setWallets(newWallets)
    setWalletsIsDeployed(newWalletsIsDeployed)

    setSelectedWallet(newWallets[Object.keys(newWallets)[0]].address) // temp - using only one wallet
  }

  const onRequest: OnRequest = request => setRequests([request])
  const closeRequest = () => setRequests([] as Requests)

  const createRIFWallet = createRIFWalletFactory(onRequest)

  const handleLoadExistingWallets = loadExistingWallets(createRIFWallet)
  const handleCreateKMS = creteKMS(createRIFWallet)

  const unlockApp = async () => {
    setLoading(true)

    const { kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary } = await handleLoadExistingWallets()

    setLoading(false)

    setKeys(kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary)
  }

  const createFirstWallet = async (mnemonic: string) => {
    setLoading(true)

    const { kms, rifWallet, rifWalletsDictionary, rifWalletsIsDeployedDictionary  } = await handleCreateKMS(mnemonic)

    setKeys(kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary)
    setAppHasKeys(true)

    setLoading(false)

    return rifWallet
  }

  useEffect(() => {
    (async () => {
      await i18nInit

      setAppHasKeys(!!await hasKeys())
      setLoading(false)
    })()
  }, [])

  return (
    <SafeAreaView>
      <StatusBar />
      {loading && <LoadingScreen reason="Please wait..." />}
      <Wrapper {...{removeKeys, appHasKeys, unlockApp}}>
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
      </Wrapper>
    </SafeAreaView>
  )
}

export default App
