import { getChainIdByType, shortAddress } from 'lib/utils'

import { ChainTypeEnum } from 'store/slices/settingsSlice/types'

import { toChecksumAddress } from './lib'

export const getAddressDisplayText = (
  inputAddress: string,
  chainType: ChainTypeEnum,
) => {
  const checksumAddress = toChecksumAddress(
    inputAddress,
    getChainIdByType(chainType),
  )
  const displayAddress = shortAddress(checksumAddress)
  return { checksumAddress, displayAddress }
}
