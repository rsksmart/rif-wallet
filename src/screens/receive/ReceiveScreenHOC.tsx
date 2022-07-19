import React, { useEffect, useState } from 'react'
import { useSelectedWallet } from '../../Context'

import { getDomains } from '../../storage/DomainsStore'

import { ReceiveScreen, ReceiveScreenProps } from './ReceiveScreen'

export const ReceiveScreenHOC: React.FC<ReceiveScreenProps> = () => {
  const { wallet } = useSelectedWallet()
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])
  const [chainId, setChainId] = useState<number>(31)

  useEffect(() => {
    getDomains(wallet.smartWalletAddress).then(setRegisteredDomains)
    wallet.getChainId().then(setChainId)
  }, [wallet])

  return (
    <ReceiveScreen
      smartWalletAddress={wallet.smartWalletAddress}
      registeredDomains={registeredDomains}
      chainId={chainId}
    />
  )
}
