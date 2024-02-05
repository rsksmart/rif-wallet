import { RootState } from 'store/store'

export const selectRequests = ({ settings }: RootState) => settings.requests

export const selectTopColor = ({ settings }: RootState) => settings.topColor

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

export const selectBitcoin = ({ settings }: RootState) => settings.bitcoin

export const selectChainId = ({ settings }: RootState) => settings.chainId
