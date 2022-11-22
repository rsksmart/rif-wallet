import { RSKRegistrar } from '@rsksmart/rns-sdk'

import {
  getAliasRegistration,
  hasAliasRegistration,
  IProfileRegistrationStore,
  saveAliasRegistration,
} from 'src/storage/AliasRegistrationStore'
import addresses from '../../screens/rnsManager/addresses.json'
import { RIFWallet } from 'lib/core'

export function useAliasRegistration(wallet: RIFWallet) {
  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )

  const registrationStarted = () => {
    const hasStartedRegistration = hasAliasRegistration()

    if (hasStartedRegistration) {
      const myAliasRegistration = getAliasRegistration()
      const hash = myAliasRegistration.commitToRegisterHash
      return !!hash
    }
  }
  const readyToRegister = async (_hash?: string) => {
    if (registrationStarted()) {
      const myAliasRegistration: IProfileRegistrationStore =
        getAliasRegistration()
      const hash = _hash || myAliasRegistration.commitToRegisterHash
      const canReveal = await rskRegistrar.canReveal(hash)
      return await canReveal()
    } else {
      return false
    }
  }
  const getRegistrationData = getAliasRegistration

  const setRegistrationData = async (
    alias: string,
    duration: number,
  ): Promise<IProfileRegistrationStore> => {
    const response = await rskRegistrar.commitToRegister(
      alias,
      wallet.smartWallet.address,
    )

    await saveAliasRegistration({
      alias: alias,
      duration: duration,
      commitToRegisterSecret: response.secret,
      commitToRegisterHash: response.hash,
    })
    await response.makeCommitmentTransaction.wait()
    console.log('commitToRegister succesfull')
    return getRegistrationData()
  }

  return {
    registrationStarted,
    readyToRegister,
    getRegistrationData,
    setRegistrationData,
  }
}
