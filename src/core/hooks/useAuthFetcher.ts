import axios, { AxiosInstance } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useEffect } from "react";
import * as Keychain from 'react-native-keychain'
import { RifWalletServicesFetcher } from "../../lib/rifWalletServices/RifWalletServicesFetcher";
import { getWalletSetting, SETTINGS } from "../config";


export const useAuthFetch = (axiosInstance: AxiosInstance, accessToken: string, refreshToken: string ) => {

  const uri = getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL)
  
  useEffect(() => {
    const id = axiosInstance.interceptors.request.use(
      config => {
        if (!config.headers?.Authorization) {
          config.headers!.Authorization = `DIDAuth ${accessToken}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      },
    )
    return () => {
      axiosInstance.interceptors.request.eject(id)
    }
  }, [])

  const refreshAuthLogic = async (failedRequest: any) => {
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

    }
  }

  createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {})

  const fetcher = new RifWalletServicesFetcher(axiosInstance)

  return { fetcher }
}