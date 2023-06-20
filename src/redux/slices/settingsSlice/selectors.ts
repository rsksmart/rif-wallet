import { RootState } from 'store/store'

export const selectRequests = ({ settings }: RootState) => settings.requests

export const selectTopColor = ({ settings }: RootState) => settings.topColor

export const selectChainType = ({ settings }: RootState) => settings.chainType

export const selectSelectedWallet = ({ settings }: RootState) =>
  settings.selectedWallet

export const selectWallets = ({ settings }: RootState) => settings.wallets

export const selectWalletIsDeployed = ({ settings }: RootState) =>
  settings.walletsIsDeployed

export const selectSettingsIsLoading = ({ settings }: RootState) =>
  settings.loading

export const selectWholeSettingsState = ({ settings }: RootState) => settings

export const selectActiveWallet = ({
  settings: { selectedWallet, wallets, walletsIsDeployed, chainType, chainId },
}: RootState) => ({
  wallet: wallets?.[selectedWallet] || null,
  walletIsDeployed:
    selectedWallet && walletsIsDeployed
      ? walletsIsDeployed[selectedWallet]
      : null,
  chainType: chainType,
  chainId: chainId,
  activeWalletIndex:
    selectedWallet && wallets
      ? Object.keys(wallets).indexOf(selectedWallet)
      : undefined,
})

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
