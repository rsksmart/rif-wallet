import { useCallback, useEffect, useRef } from 'react'
import {
  removeKeysFromState,
  selectAppIsActive,
  selectIsUnlocked,
  setAppIsActive,
  setUnlocked as setIsUnlocked,
} from 'store/slices/settingsSlice'

import { Platform } from 'react-native'
import BackgroundTimer from 'react-native-background-timer'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { useAppState } from './useAppState'

const gracePeriod = 3000
let timer: NodeJS.Timer

export const useStateSubscription = () => {
  const dispatch = useAppDispatch()
  const active = useAppSelector(selectAppIsActive)
  const unlocked = useAppSelector(selectIsUnlocked)
  const { appState } = useAppState()
  const timerRef = useRef<NodeJS.Timer>(timer)

  const setUnlocked = useCallback(
    (isUnlocked: boolean) => {
      dispatch(setIsUnlocked(isUnlocked))
    },
    [dispatch],
  )

  useEffect(() => {
    const isNowActive = appState === 'active'
    dispatch(setAppIsActive(isNowActive))

    if (unlocked) {
      console.log('useStateSubscription', 'app is unlocked')
      if (!isNowActive) {
        console.log('useStateSubscription', 'app is inactive, setting timer')
        if (Platform.OS === 'android') {
          timerRef.current = BackgroundTimer.setTimeout(() => {
            console.log('useStateSubscription', 'timer expired, locking app')
            setUnlocked(false)
            dispatch(removeKeysFromState())
          }, gracePeriod)
        } else {
          timerRef.current = setTimeout(() => {
            console.log('useStateSubscription', 'timer expired, locking app')
            setUnlocked(false)
            dispatch(removeKeysFromState())
          }, gracePeriod)
        }
      } else if (timerRef.current) {
        console.log('useStateSubscription', 'app is active, clearing timer')
        if (Platform.OS === 'android') {
          BackgroundTimer.clearTimeout(timerRef.current)
        } else {
          clearTimeout(timerRef.current)
        }
      }
    } else {
      console.log('useStateSubscription', 'app is locked')
    }
  }, [unlocked, appState, dispatch, setUnlocked])

  return {
    unlocked,
    setUnlocked,
    active,
  }
}
