import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { OnRequest } from '../../lib/core'
import { useKeyManagementSystem } from './useKeyManagementSystem'

const gracePeriod = 3000
let timer: NodeJS.Timeout

export const useStateSubscription = (onRequest: OnRequest) => {
  const [active, setActive] = useState(true)
  const [unlocked, setUnlocked] = useState(false)

  const timerRef = useRef<NodeJS.Timeout>(timer)

  const { removeKeys } = useKeyManagementSystem(onRequest)

  useEffect(() => {
    const stateSubscription = AppState.addEventListener(
      'change',
      appStateStatus => {
        const isNowActive = appStateStatus === 'active'
        setActive(isNowActive)

        if (unlocked) {
          if (!isNowActive) {
            const newTimer = setTimeout(() => {
              setUnlocked(false)
              removeKeys()
            }, gracePeriod)

            timerRef.current = newTimer
          } else {
            if (timerRef.current) {
              clearTimeout(timerRef.current)
            }
          }
        }
      },
    )

    return () => {
      stateSubscription.remove()
    }
  }, [unlocked])

  return {
    unlocked,
    setUnlocked,
    active,
  }
}
