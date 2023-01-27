import { useCallback, useEffect, useRef } from 'react'
import {
  removeKeysFromState,
  selectAppIsActive,
  selectIsUnlocked,
  setAppIsActive,
  setUnlocked as setIsUnlocked,
} from 'store/slices/settingsSlice'

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
      if (timerRef.current) {
        BackgroundTimer.clearTimeout(timerRef.current)
      }
      if (!isNowActive) {
        timerRef.current = BackgroundTimer.setTimeout(() => {
          setUnlocked(false)
          dispatch(removeKeysFromState())
        }, gracePeriod)
      }
    }
  }, [unlocked, appState, dispatch, setUnlocked])

  return {
    unlocked,
    setUnlocked,
    active,
  }
}
