import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'

import { getAddressDisplayText } from './Address'

export const useIsMyAddress = (address: string) => {
  const { wallet, chainType } = useAppSelector(selectActiveWallet)
  if (wallet && chainType) {
    const myAddress = getAddressDisplayText(
      wallet.smartWalletAddress,
      chainType,
    ).checksumAddress
    return myAddress.toLowerCase() === address.toLowerCase()
  }

  return false
}
