import React from 'react'
import { DefaultRelayingServices } from "@rsksmart/relaying-services-sdk"
import { RifRelayService } from '../lib/rifRelayService/RifRelayService'
import { useSelectedWallet } from '../Context'
import { RifRelayProviderProps } from './types'

const RifRelayProviderContext = React.createContext<
  { rifRelayProvider: DefaultRelayingServices | undefined} | undefined
>(undefined)


export function RifRelayProvider(
  {children, rifRelayService}: RifRelayProviderProps) {

  const [rifRelayProvider, setRifRelayProvider] = React.useState<DefaultRelayingServices | undefined>(undefined)

  const { wallet } = useSelectedWallet()

  React.useEffect(() => {
    if(wallet && rifRelayService) {
      rifRelayService.init(wallet)
      .then(provider => setRifRelayProvider(provider))
    }
  }, [wallet])

  return (<RifRelayProviderContext.Provider value={{rifRelayProvider}}>
    {children}
    </RifRelayProviderContext.Provider>)

}

export function useRifRelayProviderState() {
  const context = React.useContext(RifRelayProviderContext)
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionsProvider',
    )
  }
  return context
}