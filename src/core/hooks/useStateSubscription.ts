import { useEffect, useRef, useState } from 'react'
import useAppState from './useAppState'

const gracePeriod = 3000
let timer: NodeJS.Timeout

export const useStateSubscription = (onScreenLock?: Function) => {
  const [active, setActive] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const [appState] = useAppState()
  const timerRef = useRef<NodeJS.Timeout>(timer)

  useEffect(() => {
    const isNowActive = appState === 'active'
    setActive(isNowActive)

    if (unlocked) {
      if (!isNowActive) {
        timerRef.current = setTimeout(() => {
          setUnlocked(false)
          onScreenLock?.()
        }, gracePeriod)
      } else if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [unlocked, appState])

  return {
    unlocked,
    setUnlocked,
    active,
  }
}
