import React, { useEffect, useState } from 'react'
import { useSelectedWallet } from '../../Context'

import { getDomains } from '../../storage/DomainsStore'

import { ReceiveScreen, ReceiveScreenProps } from './ReceiveScreen'
import { getAddressDisplayText } from '../../components'

export const ReceiveScreenHOC: React.FC<ReceiveScreenProps> = () => {
  const { wallet, chainId } = useSelectedWallet()
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  useEffect(() => {
    setRegisteredDomains(getDomains(wallet.smartWalletAddress))
  }, [wallet])

  const { checksumAddress, displayAddress } = getAddressDisplayText(
    wallet.smartWalletAddress,
    chainId,
  )

  return (
    <ReceiveScreen
      address={checksumAddress}
      displayAddress={displayAddress}
      registeredDomains={registeredDomains}
    />
  )
}
