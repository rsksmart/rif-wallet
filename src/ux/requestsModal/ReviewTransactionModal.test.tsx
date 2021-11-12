import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'

import ReviewTransactionModal from './ReviewTransactionModal'
import { RIFWallet, SendTransactionRequest } from '../../lib/core/RIFWallet'
import { BigNumber } from '@ethersproject/bignumber'
import { setupTest } from '../../../testLib/setup'
import { getAllTokens, makeRBTCToken } from '../../lib/token/tokenMetadata'
import { tenPow } from '../../lib/token/BaseToken'
import { providers } from 'ethers'
import { ERC677__factory } from '../../lib/token/types'
import { ERC20Token } from '../../lib/token/ERC20Token'
import { RBTCToken } from '../../lib/token/RBTCToken'

jest.mock('../../lib/token/tokenMetadata', () => ({
  getAllTokens: jest.fn(),
  makeRBTCToken: jest.fn(),
  MAINNET_CHAINID: 30,
}))

const flushPromises = () => new Promise(setImmediate)

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

describe('ReviewTransactionModal', function (this: {
  confirm: ReturnType<typeof jest.fn>
  cancel: ReturnType<typeof jest.fn>
  queuedTransaction: SendTransactionRequest
  rifWallet: RIFWallet
  tokenAddress1: string
  tokenAddress2: string
}) {
  beforeEach(async () => {
    this.confirm = jest.fn()
    this.cancel = jest.fn()

    const mock = await setupTest()
    this.rifWallet = mock.rifWallet

    const initialBalance = BigNumber.from(200)

    // using ERC677__factory that supports ERC20 to set totalSupply (just for testing purpose)
    const initialSupply = initialBalance.mul(tenPow(TEST_TOKEN_DECIMALS))
    const deploySigner = await getSigner()

    const erc677Factory = new ERC677__factory(deploySigner)
    const firstErc20 = (await erc677Factory.deploy(
      await deploySigner.getAddress(),
      initialSupply,
      'FIRST_TEST_ERC20',
      'FIRST_TEST_ERC20',
    )) as any

    const secondErc20 = (await erc677Factory.deploy(
      await deploySigner.getAddress(),
      initialSupply,
      'SECOND_TEST_ERC20',
      'SECOND_TEST_ERC20',
    )) as any

    this.tokenAddress1 = firstErc20.address
    this.tokenAddress2 = secondErc20.address

    const firstErc20Token = new ERC20Token(
      this.tokenAddress1,
      deploySigner,
      'FIRST_TEST_ERC20',
      'logo.jpg',
    )

    const secondErc20Token = new ERC20Token(
      this.tokenAddress2,
      deploySigner,
      'SECOND_TEST_ERC20',
      'logo.jpg',
    )

    const getAllTokensMock = async () => [firstErc20Token, secondErc20Token]
    const makeRBTCTokenMock = () => {
      return new RBTCToken(deploySigner, 'TRBTC', 'logo.jpg', 31)
    }
    // @ts-ignore
    getAllTokens.mockImplementation(getAllTokensMock)
    // @ts-ignore
    makeRBTCToken.mockImplementation(makeRBTCTokenMock)

    this.queuedTransaction = {
      type: 'sendTransaction',
      payload: [
        {
          to: this.tokenAddress1,
          from: '0x456',
          data: '',
          value: BigNumber.from(1000),
          gasLimit: BigNumber.from(10000),
          gasPrice: BigNumber.from(600000000),
        },
      ],
      //@ts-ignore
      confirm: this.confirm,
      reject: this.cancel,
    }
  })

  it('renders', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <ReviewTransactionModal
        wallet={this.rifWallet}
        request={this.queuedTransaction}
        closeModal={jest.fn()}
      />,
    )

    // make sure elements are showing up
    expect(getAllByText('Review Transaction').length).toBe(1)
    getByPlaceholderText('gas limit')
    getByPlaceholderText('gas price')
  })

  it('returns the initial transaction', async () => {
    const closeModal = jest.fn()
    const { getByTestId, findAllByTestId } = await waitFor(() =>
      render(
        <ReviewTransactionModal
          wallet={this.rifWallet}
          request={this.queuedTransaction}
          closeModal={closeModal}
        />,
      ),
    )

    await findAllByTestId('TX_VIEW', { timeout: 500 })

    fireEvent.press(getByTestId('Confirm.Button'))

    await flushPromises()

    expect(this.confirm).toBeCalledWith({
      gasPrice: this.queuedTransaction.payload[0].gasPrice,
      gasLimit: this.queuedTransaction.payload[0].gasLimit,
    })
    expect(closeModal).toBeCalled()
  })

  it('returns nothing if cancelled', async () => {
    const closeModal = jest.fn()

    const { getByTestId, findAllByTestId } = await waitFor(() =>
      render(
        <ReviewTransactionModal
          wallet={this.rifWallet}
          request={this.queuedTransaction}
          closeModal={closeModal}
        />,
      ),
    )

    await findAllByTestId('TX_VIEW', { timeout: 500 })

    fireEvent.press(getByTestId('Cancel.Button'))
    expect(this.cancel).toBeCalled()
    expect(closeModal).toBeCalled()
  })

  it('allows the user to change the text inputs', async () => {
    const closeModal = jest.fn()
    const { getByTestId, findAllByTestId } = await waitFor(() =>
      render(
        <ReviewTransactionModal
          wallet={this.rifWallet}
          request={this.queuedTransaction}
          closeModal={closeModal}
        />,
      ),
    )

    await findAllByTestId('TX_VIEW', { timeout: 500 })

    const gasPrice = '20'
    const gasLimit = '1000'

    fireEvent.changeText(getByTestId('gasLimit.TextInput'), gasLimit)
    fireEvent.changeText(getByTestId('gasPrice.TextInput'), gasPrice)

    fireEvent.press(getByTestId('Confirm.Button'))

    await flushPromises()

    expect(this.confirm).toBeCalledWith({
      gasPrice: BigNumber.from(gasPrice),
      gasLimit: BigNumber.from(gasLimit),
    })
    expect(closeModal).toHaveBeenCalled()
  })

  it('estimates gasLimit', async () => {
    const transaction: SendTransactionRequest = {
      ...this.queuedTransaction,
      payload: [
        {
          to: '0x123',
          from: '0x45',
          data: '0x1234567890',
          gasPrice: '200',
        },
      ],
    }

    jest
      .spyOn(this.rifWallet.smartWallet, 'estimateDirectExecute')
      .mockResolvedValue(BigNumber.from(600))

    const { getByTestId } = render(
      <ReviewTransactionModal
        wallet={this.rifWallet}
        request={transaction}
        closeModal={jest.fn()}
      />,
    )

    const gasLimit = await waitFor(
      async () => await getByTestId('gasLimit.TextInput'),
    )
    expect(gasLimit.props.value).toBe('600') // spied value
    expect(getByTestId('gasPrice.TextInput').props.value).toBe('200') // original value
  })
})
