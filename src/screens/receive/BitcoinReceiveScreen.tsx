import { useState, useEffect, useMemo } from 'react'

import { shortAddress } from 'lib/utils'

import { Loading } from 'components/index'
import { getDomains } from 'storage/DomainsStore'
import { ReceiveScreen } from './ReceiveScreen'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'

export const BitcoinReceiveScreen = ({
  route: {
    params: { network },
  },
}: RootStackScreenProps<rootStackRouteNames.ReceiveBitcoin>) => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  const { wallet } = useAppSelector(selectActiveWallet)

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
  }, [network.bips])

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
