import React from 'react'
import { providers, BigNumber } from 'ethers'
import { tenPow } from '../../lib/token/BaseToken'
import { ERC20Token } from '../../lib/token/ERC20Token'
import { ERC677__factory } from '../../lib/token/types'

import { render, fireEvent, act, waitFor } from '@testing-library/react-native'

import SendTransaction from './SendTransaction'
import { getAllTokens } from '../../lib/token/tokenMetadata'

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

jest.mock('../../lib/token/tokenMetadata', () => ({
  getAllTokens: jest.fn(),
}))

describe('Load Tokens', () => {
  const route = {
    params: {
      account: {
        smartWalletAddress: '0xbd4c8e11cf2c560382e0dbd6aeef538debf1d449',
      },
    },
  }
  let tokenAddress1 = ''
  let tokenAddress2 = ''

  beforeEach(async () => {
    const account = await getSigner()
    const accountAddress = await account.getAddress()

    // using ERC677__factory that supports ERC20 to set totalSupply (just for testing purpose)
    const initialSupply = BigNumber.from(200).mul(tenPow(TEST_TOKEN_DECIMALS))
    const erc677Factory = new ERC677__factory(account)
    const firstErc20 = (await erc677Factory.deploy(
      accountAddress,
      initialSupply,
      'FIRST_TEST_ERC20',
      'FIRST_TEST_ERC20',
    )) as any

    const secondErc20 = (await erc677Factory.deploy(
      accountAddress,
      initialSupply,
      'SECOND_TEST_ERC20',
      'SECOND_TEST_ERC20',
    )) as any

    tokenAddress1 = firstErc20.address
    tokenAddress2 = secondErc20.address

    const firstErc20Token = new ERC20Token(
      tokenAddress1,
      account,
      'FIRST_TEST_ERC20',
      'logo.jpg',
    )

    const secondErc20Token = new ERC20Token(
      tokenAddress2,
      account,
      'SECOND_TEST_ERC20',
      'logo.jpg',
    )
    const getAllTokensMock = async () => [firstErc20Token, secondErc20Token]
    // @ts-ignore
    getAllTokens.mockImplementation(getAllTokensMock)
  })

  it('renders', async () => {
    const { getByPlaceholderText } = await waitFor(() =>
      render(<SendTransaction route={route} />),
    )
    getByPlaceholderText('Amount')
    getByPlaceholderText('To')
  })

  test('selects tokens', async () => {
    const { getByTestId } = await waitFor(() =>
      render(<SendTransaction route={route} />),
    )

    const picker = getByTestId('Tokens.Picker')

    await act(async () => {
      await fireEvent(picker, 'onValueChange', 'FIRST_TEST_ERC20')
      expect(picker.props.selectedIndex).toStrictEqual(0)

      await fireEvent(picker, 'onValueChange', 'SECOND_TEST_ERC20')
      expect(picker.props.selectedIndex).toBe(1)
    })
  })

  test('send transaction', async () => {
    const { getByTestId } = await waitFor(() =>
      render(<SendTransaction route={route} />),
    )

    const receivingAccount = await getSigner(1)
    const receivingAddress = await receivingAccount.getAddress()
    const sendingAmount = '10'

    act(() => {
      const picker = getByTestId('Tokens.Picker')
      fireEvent(picker, 'onValueChange', 'FIRST_TEST_ERC20')
    })

    act(() => {
      fireEvent.changeText(getByTestId('To.Input'), receivingAddress)
    })
    act(() => {
      fireEvent.changeText(getByTestId('Amount.Input'), sendingAmount)
    })
    await act(async () => {
      fireEvent.press(getByTestId('Next.Button'))
      await waitFor(() => expect(getByTestId('TxReceipt.View')).toBeDefined())
    })
  })
})
