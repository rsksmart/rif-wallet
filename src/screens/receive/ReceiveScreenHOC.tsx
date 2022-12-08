import { useEffect, useState } from 'react'

import { getDomains } from '../../storage/DomainsStore'

import { ReceiveScreen } from './ReceiveScreen'
import { getAddressDisplayText } from '../../components'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'

export const ReceiveScreenHOC = () => {
  const { wallet, chainId } = useAppSelector(selectActiveWallet)
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  useEffect(() => {
    if (wallet) {
      setRegisteredDomains(getDomains(wallet.smartWalletAddress))
    }
  }, [wallet])

  if (wallet && chainId) {
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
