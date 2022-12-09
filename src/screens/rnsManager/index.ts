import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { Signer } from 'ethers'
import addresses from './addresses.json'

export const createRSKRegistrar = (wallet: Signer) => {
  return new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )
}
