import { useEffect, useState } from 'react'
import { AppState } from 'react-native'

export function useAppState() {
  const [appState, setAppState] = useState(AppState.currentState)

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState)
    return () => sub.remove()
  }, [appState])

  return { appState, setAppState }
}
