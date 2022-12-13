import { useCallback, useEffect, useRef } from 'react'
import {
  removeKeysFromState,
  selectAppIsActive,
  selectIsUnlocked,
  setAppIsActive,
  setUnlocked as setIsUnlocked,
} from 'store/slices/settingsSlice'

import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { useAppState } from './useAppState'

const gracePeriod = 3000
let timer: NodeJS.Timeout

export const useStateSubscription = () => {
  const dispatch = useAppDispatch()
  const active = useAppSelector(selectAppIsActive)
  const unlocked = useAppSelector(selectIsUnlocked)
  const { appState } = useAppState()
  const timerRef = useRef<NodeJS.Timeout>(timer)

  const setUnlocked = useCallback((isUnlocked: boolean) => {
    dispatch(setIsUnlocked(isUnlocked))
  }, [])

  useEffect(() => {
    const isNowActive = appState === 'active'
    dispatch(setAppIsActive(isNowActive))

    if (unlocked) {
      if (!isNowActive) {
        timerRef.current = setTimeout(() => {
          setUnlocked(false)
          dispatch(removeKeysFromState())
        }, gracePeriod)
      } else if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [unlocked, appState, onScreenLock])

  return {
    unlocked,
    setUnlocked,
    active,
  }
}
