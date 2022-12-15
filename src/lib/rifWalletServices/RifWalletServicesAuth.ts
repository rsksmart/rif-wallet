import { AxiosInstance } from 'axios'
import {
  deleteSignUp,
  getSignUP,
  hasSignUP,
  saveSignUp,
} from '../../storage/MainStorage'
import { RIFWallet } from '../core'
import * as Keychain from 'react-native-keychain'
import {
  AuthenticationChallengeType,
  AuthenticationTokensType,
} from './RIFWalletServicesTypes'

export class RifWalletServicesAuth {
  axiosInstance: AxiosInstance
  wallet: RIFWallet
  did: string

  constructor(axiosInstance: AxiosInstance, wallet: RIFWallet) {
    this.axiosInstance = axiosInstance
    this.wallet = wallet
    this.did = `did:ethr:rsk:testnet:${wallet?.address}`
  }

  signup = async () => {
    const {
      data: { challenge },
    } = await this.axiosInstance.get<AuthenticationChallengeType>(
      `/request-signup/${this.did}`,
    )
    const sig = await this.signMessage(challenge)
    const {
      data: { accessToken, refreshToken },
    } = await this.axiosInstance.post<AuthenticationTokensType>('/signup', {
      response: { sig, did: this.did },
    })
    await Keychain.setInternetCredentials(
      'jwt',
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    )
    saveSignUp({ signup: true })
    return { accessToken, refreshToken }
  }

  signMessage = async (challenge: string) => {
    const message = `URL: ${this.axiosInstance.getUri()}\nVerification code: ${challenge}`
    return await this.wallet?.smartWallet.signer.signMessage(message)
  }

  authenticate = async () => {
    const {
      data: { challenge },
    } = await this.axiosInstance.get<AuthenticationChallengeType>(
      `/request-auth/${this.did}`,
    )
    const sig = await this.signMessage(challenge)
    const {
      data: { accessToken, refreshToken },
    } = await this.axiosInstance.post<AuthenticationTokensType>('/auth', {
      response: { sig, did: this.did },
    })
    await Keychain.setInternetCredentials(
      'jwt',
      'token',
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    )
    return { accessToken, refreshToken }
  }

  login = async () => {
    if (hasSignUP()) {
      const { signup } = getSignUP()
      if (!signup) {
        return await this.signup()
      } else {
        return await this.authenticate()
      }
    } else {
      return await this.authenticate()
    }
  }

  refresh = async (oldRefreshToken: string) => {
    const {
      data: { accessToken, refreshToken },
    } = await this.axiosInstance.post<AuthenticationTokensType>(
      '/refresh-token',
      {
        refreshToken: oldRefreshToken,
      },
    )

    return { accessToken, refreshToken }
  }

  logout = async (accessToken: string) => {
    await this.axiosInstance.post<void>(
      '/logout',
      {},
      { headers: { Authorization: `DIDAuth ${accessToken}` } },
    )
  }

  deleteCredentials = async () => {
    await Keychain.resetInternetCredentials('jwt')
    deleteSignUp()
  }
}
