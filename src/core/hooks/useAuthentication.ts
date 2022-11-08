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

export const useAuthentication = (publicAxios: Axios, wallet: RIFWallet) => {
  const [authState, setAuthState] = useState({
    accessToken: '',
    refreshToken: '',
    authenticated: false,
    signedup: false
  })

  const did = `did:ethr:rsk:testnet:${wallet.address}`

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
    setAuthState({
      accessToken,
      refreshToken,
      authenticated: true,
      signedup: true
    })
    console.log('Credentials',authState)
    await Keychain.setInternetCredentials(
      'jwt',
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    );
    await saveSignUp({ signedup: true })
  }

  const signMessage = async (challenge: string) => {
    const message = `URL: ${publicAxios.getUri()}\nVerification code: ${challenge}`
    return await wallet.smartWallet.signer.signMessage(message)
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
    setAuthState({
      ...authState,
      accessToken,
      refreshToken,
      authenticated: true,
    })
    await Keychain.setInternetCredentials(
      'jwt',
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    );
  }

  const login = async () => {
    if (!authState.signedup) {
      console.log('Signup')
      await signup()
    } else {
      console.log('authenticate')
      await authenticate()
    }
  }

  const refresh = async () => {
    const { data: { accessToken, refreshToken }} =
      await publicAxios.post<AuthenticationTokensType>('/refresh-token', { refreshToken: authState.refreshToken })
    setAuthState({ ...authState, accessToken, refreshToken })
  }

  const logout = async () => {
    await publicAxios.post<void>('/logout',{}, { headers: { 'Authorization': `DIDAuth ${authState.accessToken}`}})
  }

  const deleteCredentials = async () => {
    setAuthState({
      ...authState,
      accessToken: '',
      refreshToken: '',
      authenticated: false,
    })
    await deleteSignUp()
  }

  return { authState, setAuthState, login, refresh, logout, deleteCredentials }
}
