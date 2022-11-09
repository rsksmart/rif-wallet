import { Axios } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AppContext, useSelectedWallet } from '../../Context'
import {
  AuthenticationChallengeType,
  AuthenticationTokensType,
} from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import * as Keychain from 'react-native-keychain'
import {
  deleteSignUp,
  getSignUP,
  hasSignUP,
  saveSignUp,
} from '../../storage/SignupStore'
import { RIFWallet } from '../../lib/core'

export type IAuthState = { 
  accessToken: string;
  refreshToken: string;
  authenticated: boolean;
  signedup: boolean;
}

const emptyAuthState: IAuthState = {
  accessToken: '',
  refreshToken: '',
  authenticated: false,
  signedup: false
}

export const useAuthentication = (publicAxios: Axios, wallet?: RIFWallet) => {

  const did = `did:ethr:rsk:testnet:${wallet?.address}`

  const signup = async () => {
    const {
      data: { challenge },
    } = await publicAxios.get<AuthenticationChallengeType>(
      `/request-signup/${did}`,
    )
    const sig = await signMessage(challenge)
    const {
      data: { accessToken, refreshToken },
    } = await publicAxios.post<AuthenticationTokensType>('/signup', {
      response: { sig, did },
    })
    await Keychain.setInternetCredentials(
      'jwt',
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    );
    await saveSignUp({ signedup: true })
    return {accessToken, refreshToken}
  }

  const signMessage = async (challenge: string) => {
    const message = `URL: ${publicAxios.getUri()}\nVerification code: ${challenge}`
    return await wallet?.smartWallet.signer.signMessage(message)
  }

  const authenticate = async () => {
    const {
      data: { challenge },
    } = await publicAxios.get<AuthenticationChallengeType>(
      `/request-auth/${did}`,
    )
    const sig = await signMessage(challenge)
    const {
      data: { accessToken, refreshToken },
    } = await publicAxios.post<AuthenticationTokensType>('/auth', {
      response: { sig, did },
    })
    await Keychain.setInternetCredentials(
      'jwt',
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    );
    return {accessToken, refreshToken}
  }

  const login = async () => {
    if(await hasSignUP()){
      const {signedup} = await getSignUP()
      if(signedup) {
        return await signup()
      } else {
        return await authenticate()
      }
    } else {
      return await authenticate()
    }
  }

  const refresh = async (oldRefreshToken: string) => {
    const { data: { accessToken, refreshToken }} =
      await publicAxios.post<AuthenticationTokensType>('/refresh-token', { refreshToken: oldRefreshToken })

    return {accessToken, refreshToken}
  }

  const logout = async (accessToken: string) => {
    await publicAxios.post<void>('/logout',{}, { headers: { 'Authorization': `DIDAuth ${accessToken}`}})
  }

  const deleteCredentials = async () => {
    await Keychain.resetInternetCredentials('jwt')
    await deleteSignUp()
  }
  

  return { login, refresh, logout, deleteCredentials }
}
