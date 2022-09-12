import { RIFWallet, OnRequest, Request } from '../src/lib/core'
import { deploySmartWalletFactory } from './contracts'
import { createNewTestWallet } from './utils'

export const setupTest = async (
  privateKey?: string,
): Promise<{
  navigation: any // { navigate: ReturnType<typeof jest.fn> }
  route: any
  rifWallet: RIFWallet
}> => {
  const smartWalletFactory = await deploySmartWalletFactory()
  const wallet = await createNewTestWallet(privateKey)
  const onRequest: OnRequest = (nextRequest: Request) => nextRequest.confirm()
  const rifRelayConfig = {
    relayVerifierAddress: '',
    deployVerifierAddress: '',
    relayServer: 'https://dev.relay.rifcomputing.net:8090',
  }

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
      // eslint-disable-next-line no-undef
      navigate: jest.fn(),
    },
    route: {} as any,
  }
}
