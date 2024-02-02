import { Wallet } from 'ethers'

import { RelayWallet } from 'lib/relayWallet'
import { OnRequest, Request } from 'lib/eoaWallet'

import { Wallet as WalletType } from 'shared/wallet'
import { getCurrentChainId } from 'storage/ChainStorage'
import { getRifRelayConfig } from 'store/slices/settingsSlice'

import { testJsonRpcProvider } from './utils'

export const setupTest = async (
  mnemonic: string,
): Promise<{
  navigation: { navigate: () => ReturnType<typeof jest.fn> }
  route: object
  wallet: WalletType
}> => {
  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
  }))

  const onRequest: OnRequest = (nextRequest: Request) => nextRequest.confirm()

  const wallet = await RelayWallet.create(
    !mnemonic
      ? (Wallet.createRandom().mnemonic as unknown as string)
      : mnemonic,
    getCurrentChainId(),
    testJsonRpcProvider,
    onRequest,
    getRifRelayConfig(getCurrentChainId()),
  )

  const deployTx = await wallet.rifRelaySdk.smartWalletFactory.deploy()
  await deployTx.wait()

  return {
    wallet,
    navigation: {
      navigate: jest.fn(),
    },
    route: {},
  }
}
