import { rifRelayConfig } from 'core/setup'
import { RIFWallet, OnRequest, Request } from '@rsksmart/rif-wallet-core'

import { createNewTestWallet } from './utils'

export const setupTest = async (
  privateKey?: string,
): Promise<{
  navigation: { navigate: () => ReturnType<typeof jest.fn> }
  route: object
  rifWallet: RIFWallet
}> => {
  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
  }))

  const wallet = await createNewTestWallet(privateKey)
  const onRequest: OnRequest = (nextRequest: Request) => nextRequest.confirm()

  const rifWallet = await RIFWallet.create(wallet, onRequest, rifRelayConfig)

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
