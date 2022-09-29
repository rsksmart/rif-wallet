import React, { useState, useEffect } from 'react'
import { Loading } from '../../components'
import { useSelectedWallet } from '../../Context'
import { getDomains } from '../../storage/DomainsStore'
import { ReceiveScreen } from './ReceiveScreen'

const BitcoinReceiveScreen: React.FC<any> = ({
  route: {
    params: { network },
  },
}) => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  const { wallet } = useSelectedWallet()

  useEffect(() => {
    getDomains(wallet.smartWalletAddress).then(setRegisteredDomains)
  }, [wallet])

  // In the future we must be able to select address type
  useEffect(() => {
    network.bips[0]
      .fetchExternalAvailableAddress()
      .then((addressBackend: string) => setAddress(addressBackend))
  }, [])

  return address ? (
    <ReceiveScreen
      registeredDomains={registeredDomains}
      address={address}
      displayAddress={address}
    />
  ) : (
    <Loading />
  )
}

export default BitcoinReceiveScreen
