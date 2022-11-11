import { RSKRegistrar } from '@rsksmart/rns-sdk'

import {
  getAliasRegistration,
  hasAliasRegistration,
  IProfileRegistrationStore,
  saveAliasRegistration,
} from '../../storage/AliasRegistrationStore'
import addresses from '../../screens/rnsManager/addresses.json'
import { RIFWallet } from '../../lib/core'

export function useAliasRegistration(wallet: RIFWallet) {
  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )

  const registrationStarted = async () => {
    let myAliasRegistration: IProfileRegistrationStore
    let hash: string
    const hasStartedRegistration = await hasAliasRegistration()

    if (hasStartedRegistration) {
      myAliasRegistration = await getAliasRegistration()
      hash = myAliasRegistration.commitToRegisterHash
      return !!hash
    }
  }
  const readyToRegister = async (_hash?: string) => {
    if (await registrationStarted()) {
      const myAliasRegistration: IProfileRegistrationStore =
        await getAliasRegistration()
      const hash = _hash || myAliasRegistration.commitToRegisterHash
      const canReveal = await rskRegistrar.canReveal(hash)
      return await canReveal()
    } else {
      return false
    }
  }
  const getRegistrationData = async (): Promise<IProfileRegistrationStore> => {
    const myAliasRegistration: IProfileRegistrationStore =
      await getAliasRegistration()
    return myAliasRegistration
  }

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
