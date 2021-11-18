import { BigNumber } from 'ethers'
import {
  getSigner,
  TEST_CHAIN_ID,
  TEST_TOKEN_DECIMALS,
} from '../../../testLib/utils'
import { RBTCToken } from './RBTCToken'

describe('RBTC token', () => {
  let rbtcToken: RBTCToken | null = null

  beforeEach(async () => {
    const account = getSigner(9)

    rbtcToken = new RBTCToken(account, 'TRBTC', 'logo.jpg', TEST_CHAIN_ID)
  })

  test('get symbol', async () => {
    const symbol = rbtcToken!.symbol

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
    const to = getSigner(1)
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
