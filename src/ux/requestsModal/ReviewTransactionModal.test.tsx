import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'

import ReviewTransactionModal from './ReviewTransactionModal'
import { RIFWallet, SendTransactionRequest } from '../../lib/core/RIFWallet'
import { BigNumber } from '@ethersproject/bignumber'
import { setupTest } from '../../../testLib/setup'
import * as tokenMetadata from '../../lib/token/tokenMetadata'
import { deployTestTokens, getSigner } from '../../../testLib/utils'

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

  it('renders', async () => {
    act(async () => {
      const { getAllByText, getByPlaceholderText } = await waitFor(() =>
        render(
          <ReviewTransactionModal
            wallet={this.rifWallet}
            request={this.queuedTransaction}
            closeModal={jest.fn()}
          />,
        ),
      )

      // make sure elements are showing up
      expect(getAllByText('Review Transaction').length).toBe(1)
      getByPlaceholderText('gas limit')
      getByPlaceholderText('gas price')
    })
  })

  it('returns the initial transaction', async () => {
    act(async () => {
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

      expect(this.confirm).toBeCalledWith({
        gasPrice: this.queuedTransaction.payload[0].gasPrice,
        gasLimit: this.queuedTransaction.payload[0].gasLimit,
      })
      expect(closeModal).toBeCalled()
    })
  })

  it('returns nothing if cancelled', async () => {
    act(async () => {
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

      // await act(() => sleep(500))
      await findAllByTestId('TX_VIEW', { timeout: 500 })

      fireEvent.press(getByTestId('Cancel.Button'))
      expect(this.cancel).toBeCalled()
      expect(closeModal).toBeCalled()
    })
  })

  it('allows the user to change the text inputs', async () => {
    act(async () => {
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

      expect(this.confirm).toBeCalledWith({
        gasPrice: BigNumber.from(gasPrice),
        gasLimit: BigNumber.from(gasLimit),
      })
      expect(closeModal).toHaveBeenCalled()
    })
  })
})
