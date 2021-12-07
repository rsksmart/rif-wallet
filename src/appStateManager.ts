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

class AppStateManager {
  changeStateFn: (newState: AvailableStates) => void
  loadWalletsFn: () => Promise<void>
  resetAppFn: () => void
  currentState: AvailableStates

  subscription: NativeEventSubscription
  timeOutId: any

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

  updateState = (nextState: AvailableStates) => {
    this.currentState = nextState
    this.changeStateFn(nextState)
  }

  handleAppStateChange = (newState: AppStateStatus) => {
    console.log('handleAppStateChange', this.currentState)

    if (newState !== 'active') {
      this.timeOutId = setTimeout(() => {
        console.log('timeout ;-)')
        this.resetAppFn()
        this.updateState(AvailableStates.BACKGROUND_LOCKED)
      }, 3000)

      return this.updateState(AvailableStates.BACKGROUND)
    }

    // Grace period
    if (this.currentState === AvailableStates.BACKGROUND) {
      console.log('GRAce Period')
      this.timeOutId && clearInterval(this.timeOutId)
      return this.updateState(AvailableStates.READY)
    }

    this.appIsActive()
  }

  public appIsActive() {
    console.log('appIsActive, check previous state...', this.currentState)

    this.updateState(AvailableStates.LOADING)

    hasKeys().then((walletHasKeys: boolean | null) => {
      if (!walletHasKeys) {
        // no keys, user should setup their wallet
        return this.updateState(AvailableStates.READY)
      }

      hasPin().then((walletHasPin: boolean | null) => {
        console.log({ walletHasPin, walletHasKeys })
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

export default AppStateManager
