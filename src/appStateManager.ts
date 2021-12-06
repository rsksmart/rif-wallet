import { AppState } from 'react-native'
import { hasKeys } from './storage/KeyStore'
import { hasPin } from './storage/PinStore'

export enum AvailableStates {
  LOADING = 'LOADING',
  LOCKED = 'LOCKED',
  BACKGROUND = 'BACKGROUND',
  READY = 'READY',
}

class AppStateManager {
  changeStateFn: (newState: AvailableStates) => void
  loadWalletsFn: () => Promise<void>

  subscription: any

  constructor(
    changeStateFn: (newState: AvailableStates) => void,
    loadWalletsFn: () => Promise<void>,
    resetAppFn: any,
  ) {
    this.changeStateFn = changeStateFn
    this.loadWalletsFn = loadWalletsFn

    const handleAppStateChange = (newState: string) => {
      if (newState !== 'active') {
        resetAppFn()
        return this.changeStateFn(AvailableStates.BACKGROUND)
      }
      this.appIsActive()
    }

    this.subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    )
  }

  public appIsActive() {
    this.changeStateFn(AvailableStates.LOADING)

    hasKeys().then((walletHasKeys: boolean | null) => {
      if (!walletHasKeys) {
        // no keys, user should setup their wallet
        return this.changeStateFn(AvailableStates.READY)
      }

      hasPin().then((walletHasPin: boolean | null) => {
        if (walletHasPin) {
          return this.changeStateFn(AvailableStates.LOCKED)
        }

        this.loadWalletsFn().then(() =>
          this.changeStateFn(AvailableStates.READY),
        )
      })
    })
  }

  public removeSubscription() {
    this.subscription.remove()
  }
}

export default AppStateManager
