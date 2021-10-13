import { providers, BigNumber } from 'ethers'
import { RBTCToken } from './RBTCToken'

const Config = {
  BLOCKCHAIN_HTTP_URL: 'HTTP://127.0.0.1:8545',
}

const TEST_TOKEN_DECIMALS = 18
const CHAIN_ID = 31

const getJsonRpcProvider = async (): Promise<providers.JsonRpcProvider> => {
  return new providers.JsonRpcProvider(Config.BLOCKCHAIN_HTTP_URL)
}

const getSigner = async (index: number = 0) => {
  const provider = await getJsonRpcProvider()
  return provider.getSigner(index)
}

describe('RBTC token', () => {
  let rbtcToken: RBTCToken | null = null

  beforeEach(async () => {
    const account = await getSigner()

    rbtcToken = new RBTCToken(account, 'logo.jpg', CHAIN_ID)
  })

  test('get symbol', async () => {
    const symbol = await rbtcToken!.symbol()

    expect(symbol).toBe('TRBTC')
  })

  test('get logo', async () => {
    const logo = rbtcToken!.logo

    expect(logo).toBe('logo.jpg')
  })

  test('get decimals', async () => {
    const decimals = await rbtcToken!.decimals()

    expect(decimals).toBe(TEST_TOKEN_DECIMALS)
  })

  test('get type', async () => {
    const type = rbtcToken!.getType()

    expect(type).toBe('rbtc')
  })

  test('get balance', async () => {
    const result = await rbtcToken!.balance()

    expect(result.gt(0)).toBe(true)
  })

  test('transfer', async () => {
    const to = await getSigner(1)
    const toAddress = await to.getAddress()

    const balanceRecipientInitial = await to.getBalance()

    const amountToTransfer = BigNumber.from(100)

    const transferTx = await rbtcToken!.transfer(toAddress, amountToTransfer)

    await transferTx.wait()

    const balanceRecipient = await to.getBalance()

    expect(
      balanceRecipient.eq(balanceRecipientInitial.add(amountToTransfer)),
    ).toBe(true)
  })
})
