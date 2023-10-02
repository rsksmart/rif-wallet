import { RootState } from 'store/store'

export const selectRequests = ({ settings }: RootState) => settings.requests

export const selectTopColor = ({ settings }: RootState) => settings.topColor

export const selectChainType = ({ settings }: RootState) => settings.chainType

export const selectWallet = ({ settings }: RootState) => {
  if (!settings.wallets) {
    throw new Error('No Wallets set!')
  }

  return settings.wallets[settings.selectedWallet]
}

export const selectWalletIsDeployed = ({ settings }: RootState) => {
  if (!settings.walletsIsDeployed) {
    throw new Error('WalletIsDeployed is not set!')
  }
  return settings.walletsIsDeployed[settings.selectedWallet]
}
export const selectSettingsIsLoading = ({ settings }: RootState) =>
  settings.loading

export const selectWholeSettingsState = ({ settings }: RootState) => settings

export const selectAppIsActive = ({ settings }: RootState) =>
  settings.appIsActive

export const selectIsUnlocked = ({ settings }: RootState) => settings.unlocked

export const selectPreviouslyUnlocked = ({ settings }: RootState) =>
  settings.previouslyUnlocked

export const selectIsSetup = ({ settings }: RootState) => settings.isSetup

export const selectFullscreen = ({ settings }: RootState) => settings.fullscreen

export const selectHideBalance = ({ settings }: RootState) =>
  settings.hideBalance
export const selectPin = ({ settings }: RootState) => settings.pin

export const selectBitcoin = ({ settings }: RootState) => settings.bitcoin

export const selectChainId = ({ settings }: RootState) => settings.chainId

export const selectWalletState = ({
  settings: { wallets, walletsIsDeployed, chainId, chainType, selectedWallet },
}: RootState) => {
  if (!wallets || !walletsIsDeployed) {
    throw new Error('No Wallet exist in state')
  }
  return {
    wallet: wallets[selectedWallet],
    walletIsDeployed: walletsIsDeployed[selectedWallet],
    chainType,
    chainId,
  }
}
