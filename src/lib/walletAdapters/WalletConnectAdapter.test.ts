import { providers } from 'ethers'
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

  beforeEach(async () => {
    const signer = await getSigner(9)

    adapter = new WalletConnectAdapter(signer)
  })

  test('send tx', async () => {
    const method = 'eth_sendTransaction'
    const params = [
      {
        data: '',
        from: '0x37a0Ee87EB3574e9965fe42dADdcAeFA5B65dFA2',
        to: '0xE2b00f36D1FE8c7b627Fd3C6d1918A08E7C51c50',
        value: '0x3e8',
      },
    ]

    const result = await adapter?.handleCall(method, params)

    expect(result?.hash).toBeDefined()
    expect(result?.hash).toContain('0x')
  })
})
