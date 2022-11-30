import { useEffect, useState } from 'react'
import { useSelectedWallet } from '../../Context'

import { getDomains } from '../../storage/DomainsStore'

import { ReceiveScreen } from './ReceiveScreen'
import { getAddressDisplayText } from '../../components'

export const ReceiveScreenHOC = () => {
  const { wallet, chainId } = useSelectedWallet()
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  useEffect(() => {
    if (wallet) {
      setRegisteredDomains(getDomains(wallet.smartWalletAddress))
    }
  }, [wallet])

  if (wallet) {
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
  } else {
    return null
  }
}
