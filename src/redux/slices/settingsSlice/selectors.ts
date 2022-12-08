import { RootState } from 'store/store'

export const selectRequests = ({ settings }: RootState) => settings.requests

export const selectTopColor = ({ settings }: RootState) => settings.topColor

export const selectChainId = ({ settings }: RootState) => settings.chainId

export const selectKMS = ({ settings }: RootState) => settings.kms

export const selectSelectedWallet = ({ settings }: RootState) =>
  settings.selectedWallet

export const selectWallets = ({ settings }: RootState) => settings.wallets

export const selectWalletIsDeployed = ({ settings }: RootState) =>
  settings.walletsIsDeployed

export const selectSettingsIsLoading = ({ settings }: RootState) =>
  settings.loading

export const selectWholeSettingsState = ({ settings }: RootState) => settings

export const selectActiveWallet = ({ settings }: RootState) => ({
  wallet: settings.wallets?.[settings.selectedWallet] || null,
  isDeployed:
    settings.selectedWallet && settings.walletsIsDeployed
      ? settings.walletsIsDeployed[settings.selectedWallet]
      : null,
  chainId: settings.chainId,
  activeWalletIndex:
    settings.selectedWallet && settings.wallets
      ? Object.keys(settings.wallets).indexOf(settings.selectedWallet)
      : undefined,
})

export const selectBitcoinCore = ({ settings }: RootState) =>
  settings.BitcoinCore
