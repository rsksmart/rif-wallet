import { providers, Signer } from 'ethers'
import { WalletConnectAdapter } from './WalletConnectAdapter'

const Config = {
  BLOCKCHAIN_HTTP_URL: 'HTTP://127.0.0.1:8545',
}

const getJsonRpcProvider = async (): Promise<providers.JsonRpcProvider> => {
  return new providers.JsonRpcProvider(Config.BLOCKCHAIN_HTTP_URL)
}

const getSigner = async (index: number = 0) => {
  const provider = await getJsonRpcProvider()
  return provider.getSigner(index)
}

describe('Wallet Connect Adapter', () => {
  let adapter: WalletConnectAdapter | null = null
  let signer: Signer | null = null

  beforeEach(async () => {
    signer = await getSigner(9)

    adapter = new WalletConnectAdapter(signer)
  })

  test('send tx', async () => {
    const from = await signer?.getAddress()
    const to = await (await getSigner(0)).getAddress()

    const method = 'eth_sendTransaction'
    const params = [
      {
        data: '',
        from,
        to,
        value: '0x3e8',
      },
    ]

    const result = await adapter?.handleCall(method, params)

    expect(result).toBeDefined()
    expect(result).toContain('0x')
  })

  test('personal sign', async () => {
    const from = await signer?.getAddress()
    const message = '0x68656c6c6f20776f726c6421'

    const method = 'personal_sign'
    const params = [message, from]

    const result = await adapter?.handleCall(method, params)

    expect(result).toBeDefined()
    expect(result).toContain('0x')
  })
})
