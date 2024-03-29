import { useCallback, useEffect, useRef, useState } from 'react'
import BackgroundTimer, { TimeoutId } from 'react-native-background-timer'

import {
  selectIsUnlocked,
  selectPreviouslyUnlocked,
  setPreviouslyUnlocked,
  setUnlocked as setIsUnlocked,
  unlockApp,
  closeRequest,
  setFullscreen,
} from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { SocketsEvents, socketsEvents } from 'src/subscriptions/rifSockets'
import { useWalletStateSetters } from 'shared/wallet'
import { useSetGlobalError } from 'components/GlobalErrorHandler'

import { useAppState } from './useAppState'
import { useIsOffline } from './useIsOffline'

const gracePeriod = 5000
let timer: TimeoutId

export const useStateSubscription = () => {
  const { setWallet, setWalletIsDeployed, initializeWallet } =
    useWalletStateSetters()
  const setGlobalError = useSetGlobalError()

  const dispatch = useAppDispatch()
  const isOffline = useIsOffline()

  const [active, setActive] = useState<boolean>(false)

  const unlocked = useAppSelector(selectIsUnlocked)
  const previouslyUnlocked = useAppSelector(selectPreviouslyUnlocked)
  const { appState, previousAppState } = useAppState()
  const timerRef = useRef<TimeoutId>(timer)

  const setUnlocked = useCallback(
    (isUnlocked: boolean) => {
      dispatch(setIsUnlocked(isUnlocked))
    },
    [dispatch],
  )

  useEffect(() => {
    if (unlocked) {
      if (timerRef.current) {
        BackgroundTimer.clearTimeout(timerRef.current)
      }
      if (!active) {
        timerRef.current = BackgroundTimer.setTimeout(() => {
          socketsEvents.emit(SocketsEvents.DISCONNECT)

          setUnlocked(false)
          dispatch(setPreviouslyUnlocked(true))
          // request needs to be reset when gracePeriod is over
          dispatch(closeRequest())
          dispatch(setFullscreen(false))
          //reset wallet state
          setWallet(null)
          setWalletIsDeployed(null)
        }, gracePeriod)
      }
    } else if (
      !unlocked &&
      previouslyUnlocked &&
      previousAppState.current === 'background' &&
      active
    ) {
      dispatch(unlockApp({ isOffline, initializeWallet, setGlobalError }))
    }
    return () => {
      socketsEvents.emit(SocketsEvents.DISCONNECT)
    }
  }, [
    unlocked,
    active,
    dispatch,
    setUnlocked,
    previousAppState,
    previouslyUnlocked,
    isOffline,
    initializeWallet,
    setWallet,
    setWalletIsDeployed,
    setGlobalError,
  ])

  useEffect(() => {
    const isNowActive = appState === 'active' || appState === 'inactive'

    setActive(isNowActive)
  }, [appState])

  return {
    unlocked,
    setUnlocked,
    active,
  }
}
