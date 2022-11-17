import { createContext, useContext } from 'react'
import { Dispatch, State, SubscriptionsProviderProps } from './types'
import { useRifSockets } from './useRifSockets'

//TODO: Move this to the backend

const RIFSocketsContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

export function RIFSocketsProvider({
  children,
  rifServiceSocket,
  abiEnhancer,
  appActive,
}: SubscriptionsProviderProps) {
  const socketsState = useRifSockets({
    rifServiceSocket,
    abiEnhancer,
    appActive,
  })

  return (
    <RIFSocketsContext.Provider value={socketsState}>
      {children}
    </RIFSocketsContext.Provider>
  )
}

export function useSocketsState() {
  const context = useContext(RIFSocketsContext)
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionsProvider',
    )
  }
  return context
}
