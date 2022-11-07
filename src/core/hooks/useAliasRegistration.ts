import { RSKRegistrar } from '@rsksmart/rns-sdk'

import {
  getAliasRegistration,
  hasAliasRegistration,
  IProfileRegistrationStore,
} from '../../storage/AliasRegistrationStore'
import addresses from '../../screens/rnsManager/addresses.json'

export function useAliasRegistration(wallet: any) {
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
  const readyToRegister = async () => {
    if (await registrationStarted()) {
      const myAliasRegistration: IProfileRegistrationStore =
        await getAliasRegistration()
      const hash = myAliasRegistration.commitToRegisterHash
      const canReveal = await rskRegistrar.canReveal(hash)
      return await canReveal()
    } else {
      return false
    }
  }
  const getRegistrationData = async () => {
    const myAliasRegistration: IProfileRegistrationStore =
      await getAliasRegistration()
    return myAliasRegistration
  }

  return { registrationStarted, readyToRegister, getRegistrationData }
}
