import React, { useEffect, useState } from 'react'
import { useSelectedWallet } from '../../Context'

import { getDomains } from '../../storage/DomainsStore'

import { ReceiveScreen, ReceiveScreenProps } from './ReceiveScreen'

export const ReceiveScreenHOC: React.FC<ReceiveScreenProps> = () => {
  const { wallet } = useSelectedWallet()
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  useEffect(() => {
    getDomains(wallet.smartWalletAddress).then(domains =>
      setRegisteredDomains(domains),
    )
  }, [wallet])
  return (
    <ReceiveScreen
      smartWalletAddress={wallet.smartWalletAddress}
      registeredDomains={registeredDomains}
    />
  )
}
