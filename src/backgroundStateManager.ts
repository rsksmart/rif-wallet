import { AppState, AppStateStatus, NativeEventSubscription } from 'react-native'

import { hasKeys } from './storage/KeyStore'
import { hasPin } from './storage/PinStore'

export enum AvailableStates {
  LOADING = 'LOADING',
  LOCKED = 'LOCKED',
  BACKGROUND = 'BACKGROUND',
  BACKGROUND_LOCKED = 'BACKGROUND_LOCKED',
  READY = 'READY',
}

class BackgroundStateManager {
  changeStateFn: (newState: AvailableStates) => void
  loadWalletsFn: () => Promise<void>
  resetAppFn: () => void
  currentState: AvailableStates

  subscription: NativeEventSubscription
  timeOutId: NodeJS.Timeout | undefined

  constructor(
    changeStateFn: (newState: AvailableStates) => void,
    loadWalletsFn: () => Promise<void>,
    resetAppFn: () => void,
  ) {
    this.changeStateFn = changeStateFn
    this.loadWalletsFn = loadWalletsFn
    this.resetAppFn = resetAppFn
    this.currentState = AvailableStates.LOADING

    this.subscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    )
  }

  private updateState = (nextState: AvailableStates) => {
    this.currentState = nextState
    this.changeStateFn(nextState)
  }

  handleAppStateChange = (newState: AppStateStatus) => {
    if (newState !== 'active') {
      this.timeOutId = setTimeout(() => {
        this.resetAppFn()
        this.updateState(AvailableStates.BACKGROUND_LOCKED)
      }, 3000)

      return this.updateState(AvailableStates.BACKGROUND)
    }

    // Still in the grace period
    if (this.currentState === AvailableStates.BACKGROUND) {
      this.timeOutId && clearInterval(this.timeOutId)
      return this.updateState(AvailableStates.READY)
    }

    this.appIsActive()
  }

  public appIsActive() {
    this.updateState(AvailableStates.LOADING)

    return hasKeys().then((walletHasKeys: boolean | null) => {
      if (!walletHasKeys) {
        // no keys, user should setup their wallet
        return this.updateState(AvailableStates.READY)
      }

      hasPin().then((walletHasPin: boolean | null) => {
        // user has pin setup
        if (walletHasPin) {
          return this.updateState(AvailableStates.LOCKED)
        }

        this.loadWalletsFn().then(() => {
          this.updateState(AvailableStates.READY)
        })
      })
    })
  }

  public removeSubscription() {
    this.subscription.remove()
  }
}

export default BackgroundStateManager
