import { Signer } from 'ethers'
import { getSigner } from '../../../testLib/utils'
import { WalletConnectAdapter } from './WalletConnectAdapter'

describe('Wallet Connect Adapter', () => {
  let adapter: WalletConnectAdapter | null = null
  let signer: Signer | null = null

  beforeEach(async () => {
    signer = getSigner(9)

    adapter = new WalletConnectAdapter(signer)
  })

  test('send tx', async () => {
    const from = await signer?.getAddress()
    const to = await getSigner(0).getAddress()

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

  // method not supported by ganache-cli
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('personal sign', async () => {
    const from = await signer?.getAddress()
    const message = '0x68656c6c6f20776f726c6421'

    const method = 'personal_sign'
    const params = [message, from]

    const result = await adapter?.handleCall(method, params)

    expect(result).toBeDefined()
    expect(result).toContain('0x')
  })

  // method not supported by ganache-cli
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('sign typed data', async () => {
    const method = 'eth_signTypedData'
    const params = [
      '0x5cD710d005a37785736eBA7d0395E73869edb8E2',
      '{"domain":{"chainId":31,"name":"Ether Mail","version":"1"},"message":{"contents":"{     from: {         name: \'Cow\',         wallet: \'0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826\'     },     to: {         name: \'Bob\',         wallet: \'0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB\'     },     contents: \'Hello, Bob!\' }","from":"Diego","to":"Cesar"},"primaryType":"Mail","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"}],"Mail":[{"name":"from","type":"string"},{"name":"to","type":"string"},{"name":"contents","type":"string"}]}}',
    ]

    const result = await adapter?.handleCall(method, params)

    expect(result).toBeDefined()
    expect(result).toContain('0x')
  })
})
