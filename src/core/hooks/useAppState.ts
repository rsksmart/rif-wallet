import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus, Platform } from 'react-native'

export function useAppState() {
  const [appState, setAppState] = useState(AppState.currentState)
  const previousAppState = useRef<AppStateStatus>(
    Platform.OS === 'ios' ? 'inactive' : 'background',
  )

  const onChange = useCallback((appStatus: AppStateStatus) => {
    setAppState(prevAppState => {
      previousAppState.current = prevAppState
      return appStatus
    })
  }, [])

  useEffect(() => {
    const sub = AppState.addEventListener('change', onChange)
    return () => sub.remove()
  }, [onChange])

  return { appState, previousAppState, setAppState }
}
