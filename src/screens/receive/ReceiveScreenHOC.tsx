import React, { useEffect, useState } from 'react'
import { useSelectedWallet } from '../../Context'

import { getDomains } from '../../storage/DomainsStore'

import { ReceiveScreen, ReceiveScreenProps } from './ReceiveScreen'

export const ReceiveScreenHOC: React.FC<ReceiveScreenProps> = () => {
  const { wallet, chainId } = useSelectedWallet()
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  useEffect(() => {
    getDomains(wallet.smartWalletAddress).then(setRegisteredDomains)
  }, [wallet])

  return (
    <ReceiveScreen
      smartWalletAddress={wallet.smartWalletAddress}
      registeredDomains={registeredDomains}
      chainId={chainId}
    />
  )
}
