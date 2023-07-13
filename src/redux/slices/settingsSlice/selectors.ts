import { RootState } from 'store/store'

export const selectIsFirstLaunch = ({ settings }: RootState) =>
  settings.isFirstLaunch

export const selectRequests = ({ settings }: RootState) => settings.requests

export const selectTopColor = ({ settings }: RootState) => settings.topColor

export const selectChainType = ({ settings }: RootState) => settings.chainType

export const selectWallet = ({ settings }: RootState) => settings.wallet

export const selectWalletIsDeployed = ({ settings }: RootState) =>
  settings.walletIsDeployed

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
  settings: { wallet, walletIsDeployed, chainId, chainType },
}: RootState) => {
  if (!wallet || !walletIsDeployed) {
    throw new Error('No Wallet exist in state')
  }
  return { wallet, walletIsDeployed, chainType, chainId }
}
