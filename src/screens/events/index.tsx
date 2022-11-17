import { useSelectedWallet } from '../../Context'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { EventsScreen } from './EventsScreen'

export const EventsScreenHOC = () => {
  const { wallet } = useSelectedWallet()
  const {
    state: { events },
  } = useSocketsState()

  return (
    <EventsScreen
      events={events}
      smartWalletAddress={wallet.smartWalletAddress}
    />
  )
}
