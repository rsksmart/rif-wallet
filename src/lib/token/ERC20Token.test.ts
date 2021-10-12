import { providers, BigNumber } from 'ethers'
import { tenPow } from './BaseToken'
import { ERC20Token } from './ERC20Token'
import { ERC20__factory } from './types'
import { ERC677__factory } from './types/factories/ERC677__factory'

const Config = {
  BLOCKCHAIN_HTTP_URL: 'HTTP://127.0.0.1:8545',
}

const TEST_TOKEN_DECIMALS = 18

const getJsonRpcProvider = async (): Promise<providers.JsonRpcProvider> => {
  return new providers.JsonRpcProvider(Config.BLOCKCHAIN_HTTP_URL)
}

const getSigner = async (index: number = 0) => {
  const provider = await getJsonRpcProvider()
  return provider.getSigner(index)
}

describe('ERC20 token', () => {
  let erc20Token: ERC20Token | null = null
  let tokenAddress = ''

  beforeEach(async () => {
    const account = await getSigner()
    const accountAddress = await account.getAddress()

    // using ERC677__factory that supports ERC20 to set totalSupply (just for testing purpose)
    const erc677Factory = new ERC677__factory(account)
    const erc20 = (await erc677Factory.deploy(
      accountAddress,
      BigNumber.from(10).mul(tenPow(TEST_TOKEN_DECIMALS)),
      'TEST_ERC20',
      'TEST_ERC20',
    )) as any

    tokenAddress = erc20.address

    erc20Token = new ERC20Token(tokenAddress, account, 'logo.jpg')
  })

  test('get symbol', async () => {
    const symbol = await erc20Token!.symbol()

    expect(symbol).toBe('TEST_ERC20')
  })

  test('get logo', async () => {
    const logo = erc20Token!.logo

    expect(logo).toBe('logo.jpg')
  })

  test('get decimals', async () => {
    const decimals = await erc20Token!.decimals()

    expect(decimals).toBe(TEST_TOKEN_DECIMALS)
  })

  test('get type', async () => {
    const type = erc20Token!.getType()

    expect(type).toBe('erc20')
  })

  test('approve amount', async () => {
    const to = await getSigner(1)
    const toAddress = await to.getAddress()
    const amountToApprove = BigNumber.from(100)

    const needsApproval = await erc20Token!.needsApproval(
      toAddress,
      amountToApprove,
    )

    const tx = await erc20Token!.approve(toAddress, amountToApprove)

    await tx.wait()

    const allowance = await erc20Token!.allowance(toAddress)

    expect(allowance.eq(amountToApprove)).toBe(true)
    expect(needsApproval).toBe(true)
    expect(tx.hash).toBeDefined()
  })

  test('get balance', async () => {
    const result = await erc20Token!.balance()

    expect(result.eq(10)).toBe(true)
  })

  test('transfer', async () => {
    const account = await getSigner()
    const accountAddress = await account.getAddress()

    const to = await getSigner(1)
    const toAddress = await to.getAddress()

    const amountToTransfer = BigNumber.from(100)

    const approveTx = await erc20Token!.approve(
      accountAddress,
      amountToTransfer,
    )

    await approveTx.wait()

    const allowance = await erc20Token!.allowance(accountAddress)

    const transferTx = await erc20Token!.transfer(toAddress, amountToTransfer)

    await transferTx.wait()

    const recipient = ERC20__factory.connect(tokenAddress, to)

    const balanceRecipient = await recipient.balanceOf(toAddress)

    expect(allowance.eq(amountToTransfer)).toBe(true)
    expect(balanceRecipient.eq(amountToTransfer)).toBe(true)
  })
})
