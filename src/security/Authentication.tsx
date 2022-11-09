import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import axios, { Axios } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import * as Keychain from 'react-native-keychain'
import { AppContext, useSelectedWallet } from '../Context'
import { getWalletSetting, SETTINGS } from '../core/config'
import { RifWalletServicesFetcher } from '../lib/rifWalletServices/RifWalletServicesFetcher'
import useBitcoinCore, { useBitcoinCoreResultType } from '../core/hooks/useBitcoinCore'
import { useAuthentication } from '../core/hooks/useAuthentication'

interface AuthenticationContextType {
  BitcoinCore: useBitcoinCoreResultType
  fetcher: RifWalletServicesFetcher
  publicAxios: Axios,
  authState: IAuthState,
  setAuthState: (value: IAuthState) => void;
  
}

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
const AxiosContext = createContext<AuthenticationContextType>({
  BitcoinCore: {
    networks: [],
    networksMap: {},
    refreshStoredNetworks: () => {},
  },
  fetcher: {} as any,
  publicAxios: {} as any,
  setAuthState: {} as any,
  authState: emptyAuthState
})


const AxiosProvider = ({ children, value }: any) => {
  const { mnemonic } = useContext(AppContext)
  const [authState, setAuthState] = useState<IAuthState>(emptyAuthState)
  const uri = getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL)

  const authAxios = axios.create({
    baseURL: uri,
  })

  const getAccessToken = () => {
    return authState.accessToken
  }

  const getRefreshToken = () => {
    return authState.refreshToken
  }
  
  authAxios.interceptors.request.use(
    config => {
      if (!config.headers?.Authorization) {
        config.headers!.Authorization = `DIDAuth ${getAccessToken()}`
      }

      return config
    },
    error => {
      return Promise.reject(error)
    },
  )

  const refreshAuthLogic = async (failedRequest: any) => {
    const refreshToken = getRefreshToken()
    const data = {
      refreshToken
    }

    const options = {
      method: 'POST',
      data,
      url: `${uri}/refresh-token`,
    }

    try {
      const tokenRefreshResponse = await axios(options)
      failedRequest.response.config.headers.Authorization =
        'DIDAuth ' + tokenRefreshResponse.data.accessToken

      setAuthState( (authState) => {
        return {
          ...authState,
          accessToken: tokenRefreshResponse.data.accessToken,
          refreshToken: tokenRefreshResponse.data.refreshToken,
        }
      })

      await Keychain.setInternetCredentials(
        'jwt',
        'token',
        JSON.stringify({
          accessToken: tokenRefreshResponse.data.accessToken,
          refreshToken: tokenRefreshResponse.data.refreshToken,
        }),
      )
      return await Promise.resolve()
    } catch (e) {
      setAuthState((authState) => {
        return {
          ...authState,
          accessToken: '',
          refreshToken: '',
          authenticated: false,
        }
      })
    }
  }

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {})

  const fetcher = new RifWalletServicesFetcher(uri, authAxios)
  const BitcoinCore = useBitcoinCore(mnemonic || '', value.onRequest , fetcher)

  return (
    <AxiosContext.Provider
      value={{
        ...value,
        BitcoinCore,
        fetcher,
        authState,
        setAuthState
      }}>
      {children}
    </AxiosContext.Provider>
  )
}

export const useBitcoinCoreContext = () => {
  const { BitcoinCore } = useContext(AxiosContext)
  return BitcoinCore
}

export { AxiosContext, AxiosProvider }
