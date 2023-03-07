import { useCallback, useEffect, useRef, useState } from 'react'
import {
  removeKeysFromState,
  selectIsUnlocked,
  setUnlocked as setIsUnlocked,
  unlockApp,
} from 'store/slices/settingsSlice'

import BackgroundTimer, { TimeoutId } from 'react-native-background-timer'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { useAppState } from './useAppState'

const gracePeriod = 3000
let timer: TimeoutId

export const useStateSubscription = () => {
  const dispatch = useAppDispatch()

  const [active, setActive] = useState<boolean>(false)
  const [previouslyActive, setPreviouslyActive] = useState<boolean>(false)

  const unlocked = useAppSelector(selectIsUnlocked)
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
          setUnlocked(false)
          dispatch(removeKeysFromState())
        }, gracePeriod)
      }
    } else if (
      !unlocked &&
      previousAppState.current === 'background' &&
      active
    ) {
      dispatch(unlockApp())
    }
  }, [unlocked, active, dispatch, setUnlocked, previousAppState])

  useEffect(() => {
    const isNowActive = appState === 'active' || appState === 'inactive'

    setActive(prevActive => {
      setPreviouslyActive(prevActive)
      return isNowActive
    })
  }, [appState])

  return {
    unlocked,
    setUnlocked,
    active,
    previouslyActive,
  }
}
