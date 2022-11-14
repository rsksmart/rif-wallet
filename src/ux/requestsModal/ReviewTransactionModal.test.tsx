import React from 'react'
import { render, waitFor, fireEvent, act } from '@testing-library/react-native'
import { cleanup } from '@testing-library/react-native'

import ReviewTransactionModal from './ReviewTransactionModal'
import { RIFWallet, SendTransactionRequest } from '../../lib/core/RIFWallet'
import { BigNumber } from '@ethersproject/bignumber'
import { setupTest } from '../../../testLib/setup'
import * as tokenMetadata from '../../lib/token/tokenMetadata'
import { deployTestTokens, getSigner } from '../../../testLib/utils'

// allows to wait the resolution of a promise,
// useful when you have a promise in a useEffect and it's triggered when the component loads for the first time.
const flushPromises = async () =>
  await act(async () => new Promise(resolve => setTimeout(resolve, 500)))

describe('ReviewTransactionModal', function (this: {
  confirm: ReturnType<typeof jest.fn>
  cancel: ReturnType<typeof jest.fn>
  queuedTransaction: SendTransactionRequest
  rifWallet: RIFWallet
}) {
  beforeEach(async () => {
    this.confirm = jest.fn()
    this.cancel = jest.fn()

    const mock = await setupTest()
    this.rifWallet = mock.rifWallet

    const accountSigner = getSigner()
    const { firstErc20Token, secondErc20Token, rbtcToken } =
      await deployTestTokens(accountSigner)

    ;(tokenMetadata.getAllTokens as any) = jest.fn(() =>
      Promise.resolve([firstErc20Token, secondErc20Token]),
    )
    ;(tokenMetadata.makeRBTCToken as any) = jest.fn(() => rbtcToken)

    this.queuedTransaction = {
      type: 'sendTransaction',
      payload: [
        {
          to: firstErc20Token.address,
          from: '0x456',
          data: '',
          value: BigNumber.from(1000),
          gasLimit: BigNumber.from(26000),
          gasPrice: BigNumber.from(20200000000),
        },
      ],
      //@ts-ignore
      confirm: this.confirm,
      reject: this.cancel,
    }
  })

  afterEach(cleanup)

  it('renders', async () => {
    const { getByText } = await waitFor(() =>
      render(
        <ReviewTransactionModal
          isWalletDeployed={true}
          wallet={this.rifWallet}
          request={this.queuedTransaction}
          closeModal={jest.fn()}
        />,
      ),
    )

    await flushPromises()

    // make sure elements are showing up
    getByText('Fee in tRIF')
  })

  it('returns the initial transaction', async () => {
    const closeModal = jest.fn()
    const { getByTestId } = await waitFor(() =>
      render(
        <ReviewTransactionModal
          isWalletDeployed={true}
          wallet={this.rifWallet}
          request={this.queuedTransaction}
          closeModal={closeModal}
        />,
      ),
    )

    await flushPromises()

    act(() => {
      fireEvent.press(getByTestId('Confirm.Button'))
    })

    const { gasPrice, gasLimit } = this.confirm.mock.calls[0][0]
    const { payload } = this.queuedTransaction

    expect(gasPrice.toString()).toBe(payload[0].gasPrice?.toString())
    expect(gasLimit.toString()).toBe(payload[0].gasLimit?.toString())

    await flushPromises()

    expect(closeModal).toBeCalled()
  })

  it('returns nothing if cancelled', async () => {
    const closeModal = jest.fn()

    const { getByTestId } = await waitFor(() =>
      render(
        <ReviewTransactionModal
          isWalletDeployed={true}
          wallet={this.rifWallet}
          request={this.queuedTransaction}
          closeModal={closeModal}
        />,
      ),
    )

    await flushPromises()

    act(() => {
      fireEvent.press(getByTestId('Cancel.Button'))
    })

    expect(this.cancel).toBeCalled()
    expect(closeModal).toBeCalled()
  })
})
