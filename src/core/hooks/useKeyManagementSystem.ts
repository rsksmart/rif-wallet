import { useState } from 'react'
import { Wallets, WalletsIsDeployed } from '../../Context'
import { KeyManagementSystem, OnRequest } from '../../lib/core'
import { deleteDomains } from '../../storage/DomainsStore'
import {
  deletePin,
  savePin,
  deleteContacts,
  deleteKeys,
} from '../../storage/MainStorage'
import {
  addNextWallet,
  creteKMS,
  deleteCache,
  loadExistingWallets,
} from '../operations'
import { createRIFWalletFactory, networkId } from '../setup'

type State = {
  hasKeys: boolean
  hasPin: boolean
  kms: KeyManagementSystem | null
  wallets: Wallets
  walletsIsDeployed: WalletsIsDeployed
  selectedWallet: string
  loading: boolean
  chainId?: number
}

const noKeysState = {
  kms: null,
  wallets: {},
  walletsIsDeployed: {},
  selectedWallet: '',
}

const initialState: State = {
  hasKeys: false,
  hasPin: false,
  ...noKeysState,
  loading: true,
  chainId: undefined,
}

export const useKeyManagementSystem = (onRequest: OnRequest) => {
  const [state, setState] = useState(initialState)

  const removeKeys = () => {
    setState({ ...state, ...noKeysState })
  }

  const resetKeysAndPin = () => {
    deleteKeys()
    deletePin()
    deleteContacts()
    deleteDomains()
    deleteCache()
    setState({ ...initialState, loading: false })
  }

  const setKeys = (
    kms: KeyManagementSystem,
    wallets: Wallets,
    walletsIsDeployed: WalletsIsDeployed,
  ) => {
    setState({
      ...state,
      hasKeys: true,
      kms,
      wallets,
      walletsIsDeployed,
      selectedWallet: wallets[Object.keys(wallets)[0]].address,
      loading: false,
    })
  }

  const createRIFWallet = createRIFWalletFactory(onRequest)

  const handleLoadExistingWallets = loadExistingWallets(createRIFWallet)
  const handleCreateKMS = creteKMS(createRIFWallet, networkId) // using only testnet

  const unlockApp = async () => {
    setState({ ...state, loading: true })
    const { kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary } =
      await handleLoadExistingWallets()
    setKeys(kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary)
  }

  const createFirstWallet = async (mnemonic: string) => {
    setState({ ...state, loading: true })
    const {
      kms,
      rifWallet,
      rifWalletsDictionary,
      rifWalletsIsDeployedDictionary,
    } = await handleCreateKMS(mnemonic)
    setKeys(kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary)
    return rifWallet
  }

  const createPin = async (newPin: string) => {
    setState({ ...state, loading: true })
    savePin(newPin)
    setState({
      ...state,
      hasPin: true,
      loading: false,
    })
  }

  const editPin = (newPin: string) => {
    savePin(newPin)
  }

  const addNewWallet = () => {
    if (!state.kms) {
      throw Error('Can not add new wallet because no KMS created.')
    }

    return addNextWallet(state.kms, createRIFWallet, networkId).then(response =>
      setState(oldState => ({
        ...oldState,
        wallets: {
          ...oldState.wallets,
          [response.rifWallet.address]: response.rifWallet,
        },
        walletsIsDeployed: {
          ...oldState.walletsIsDeployed,
          [response.rifWallet.address]: response.isDeloyed,
        },
      })),
    )
  }

  const switchActiveWallet = (address: string) =>
    setState({ ...state, selectedWallet: address })

  const setWalletIsDeployed: (address: string, value?: boolean) => void = (
    address,
    value = true,
  ) => {
    setState(curState => ({
      ...curState,
      walletsIsDeployed: {
        ...curState.walletsIsDeployed,
        [address]: value,
      },
    }))
  }

  return {
    state,
    setState,
    createFirstWallet,
    addNewWallet,
    unlockApp,
    removeKeys,
    switchActiveWallet,
    createPin,
    resetKeysAndPin,
    editPin,
    setWalletIsDeployed,
  }
}
