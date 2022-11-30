import { useState, useEffect, useMemo } from 'react'

import { Loading } from '../../components'
import { useSelectedWallet } from '../../Context'
import { getDomains } from '../../storage/DomainsStore'
import { ReceiveScreen } from './ReceiveScreen'
import { shortAddress } from '../../lib/utils'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'src/navigation/rootNavigator'

export const BitcoinReceiveScreen = ({
  route: {
    params: { network },
  },
}: RootStackScreenProps<rootStackRouteNames.ReceiveBitcoin>) => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  const { wallet } = useSelectedWallet()

  useEffect(() => {
    if (wallet) {
      setRegisteredDomains(getDomains(wallet.smartWalletAddress))
    }
  }, [wallet])

  // In the future we must be able to select address type
  useEffect(() => {
    network.bips[0]
      .fetchExternalAvailableAddress()
      .then((addressBackend: string) => setAddress(addressBackend))
  }, [])

  const shortedAddress = useMemo(() => shortAddress(address, 8), [address])
  return address ? (
    <ReceiveScreen
      registeredDomains={registeredDomains}
      address={address}
      displayAddress={shortedAddress}
    />
  ) : (
    <Loading />
  )
}
