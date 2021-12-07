import './shim'
import '@ethersproject/shims' // ref: https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative
import 'react-native-gesture-handler'
import 'react-native-get-random-values'

import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'

import { Wallets, Requests, WalletsIsDeployed } from './Context'
import { RootNavigation } from './RootNavigation'
import ModalComponent from './ux/requestsModal/ModalComponent'

import { Wallet } from '@ethersproject/wallet'
import { KeyManagementSystem, OnRequest, RIFWallet } from './lib/core'
import { getKeys, hasKeys, saveKeys, deleteKeys } from './storage/KeyStore'
import { jsonRpcProvider } from './lib/jsonRpcProvider'
import { i18nInit } from './lib/i18n'
import { Paragraph } from './components'
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

const fetcher = new RifWalletServicesFetcher()
const abiEnhancer = new AbiEnhancer()
// @ts-ignore
const rnsResolver = new Resolver.forRskTestnet()

const App = () => {
  const [ready, setReady] = useState(false)

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

  const init = async () => {
    if (await hasKeys()) {
      const serializedKeys = await getKeys()
      // eslint-disable-next-line no-shadow
      const { kms, wallets } = KeyManagementSystem.fromSerialized(
        serializedKeys!,
      )

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
    }

    await i18nInit()

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
    const rifWalletIsDeployed = await rifWallet.smartWalletFactory.isDeployed()

    save()
    const serialized = kms.serialize()
    await saveKeys(serialized)

    setKeys(
      kms,
      { [rifWallet.address]: rifWallet },
      { [rifWallet.address]: rifWalletIsDeployed },
    )

    return rifWallet
  }

  const closeRequest = () => setRequests([] as Requests)

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
        <Cover />
        <RequestPIN />
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
