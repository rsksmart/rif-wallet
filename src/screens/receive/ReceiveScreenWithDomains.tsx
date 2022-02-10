import React, { useEffect, useState } from 'react'

import { ScreenWithWallet } from '../types'
import { getDomains } from '../../storage/DomainsStore'

import { ReceiveScreen, ReceiveScreenProps } from './ReceiveScreen'

export const ReceiveScreenWithDomains: React.FC<
  ScreenWithWallet & ReceiveScreenProps
> = ({ wallet, route, isWalletDeployed }) => {
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  useEffect(() => {
    getDomains(wallet.smartWalletAddress).then(domains =>
      setRegisteredDomains(domains),
    )
  }, [])
  return (
    <ReceiveScreen
      wallet={wallet}
      isWalletDeployed={isWalletDeployed}
      route={route}
      registeredDomains={registeredDomains}
    />
  )
}
