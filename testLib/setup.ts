import { rifRelayConfig } from 'src/core/setup'
import { RIFWallet, OnRequest, Request } from '../src/lib/core'
import { deploySmartWalletFactory } from './contracts'
import { createNewTestWallet } from './utils'

export const setupTest = async (
  privateKey?: string,
): Promise<{
  navigation: { navigate: () => ReturnType<typeof jest.fn> }
  route: object
  rifWallet: RIFWallet
}> => {
  // Mock jest
  jest.mock('axios', () => ({
    get: (req: any) => {
      console.log('TACOS!', { req })
      return Promise.resolve({
        relayWorkerAddress: '0x50f072699dcdf567e60c053cc48fa5a4f3cb9236',
        relayManagerAddress: '0xda2f9da9723aea6121855111435c3aecfdd01de2',
        relayHubAddress: '0x2d4c0  18C6c9ad4487D7A4b0829A1f20246D9f5Ad',
        minGasPrice: '65164000',
        chainId: '31',
        networkId: '31',
        ready: true,
        version: '2.0.1',
        feesReceiver: '0x9b91c655AaE10E6cd0a941Aa90A6e7aa97FB02F4',
      })
    },
  }))

  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: any) => key }),
  }))

  const smartWalletFactory = await deploySmartWalletFactory()
  const wallet = await createNewTestWallet(privateKey)
  const onRequest: OnRequest = (nextRequest: Request) => nextRequest.confirm()

  const rifWallet = await RIFWallet.create(
    wallet,
    smartWalletFactory.address,
    onRequest,
    rifRelayConfig,
  )

  const deployTx = await rifWallet.smartWalletFactory.deploy()
  await deployTx.wait()

  return {
    rifWallet,
    navigation: {
      navigate: jest.fn(),
    },
    route: {},
  }
}
