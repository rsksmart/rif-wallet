import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'

import ReviewTransactionModal from './ReviewTransactionModal'
import { Request } from '../lib/core/RIFWallet'
import { BigNumber } from 'ethers'

describe('ReviewTransactionModal', function (this: {
  confirm: ReturnType<typeof jest.fn>
  cancel: ReturnType<typeof jest.fn>
  queuedTransaction: Request
}) {
  beforeEach(() => {
    this.confirm = jest.fn()
    this.cancel = jest.fn()

    this.queuedTransaction = {
      type: 'sendTransaction',
      payload: {
        transactionRequest: {
          to: '0x123',
          from: '0x456',
          data: '',
          value: BigNumber.from(1000),
          gasLimit: BigNumber.from(10000),
          gasPrice: BigNumber.from(700000000),
        },
      },
      confirm: this.confirm,
      reject: this.cancel,
    }
  })

  it('renders', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <ReviewTransactionModal
        request={this.queuedTransaction}
        closeModal={jest.fn()}
      />,
    )

    // make sure elements are showing up
    expect(getAllByText('Review Transaction').length).toBe(1)
    getByPlaceholderText('gas limit')
    getByPlaceholderText('gas price')
  })

  it('returns the initial transaction', () => {
    const closeModal = jest.fn()
    const { getByTestId } = render(
      <ReviewTransactionModal
        request={this.queuedTransaction}
        closeModal={closeModal}
      />,
    )
    fireEvent.press(getByTestId('Confirm.Button'))

    expect(this.confirm).toBeCalledWith({
      gasPrice: this.queuedTransaction.payload.transactionRequest.gasPrice,
      gasLimit: this.queuedTransaction.payload.transactionRequest.gasLimit,
    })
    waitFor(() => expect(closeModal).toBeCalled())
  })

  it('renturns nothing if cancelled', () => {
    const closeModal = jest.fn()
    const { getByTestId } = render(
      <ReviewTransactionModal
        request={this.queuedTransaction}
        closeModal={closeModal}
      />,
    )

    fireEvent.press(getByTestId('Cancel.Button'))
    expect(this.cancel).toBeCalled()
    waitFor(() => expect(closeModal).toBeCalled())
  })

  it('allows the user to change the text inputs', async () => {
    const closeModal = jest.fn()
    const { getByTestId } = render(
      <ReviewTransactionModal
        request={this.queuedTransaction}
        closeModal={closeModal}
      />,
    )

    const gasPrice = '20'
    const gasLimit = '1000'

    fireEvent.changeText(getByTestId('gasLimit.TextInput'), gasLimit)
    fireEvent.changeText(getByTestId('gasPrice.TextInput'), gasPrice)

    fireEvent.press(getByTestId('Confirm.Button'))

    expect(this.confirm).toBeCalledWith({
      gasPrice: BigNumber.from(gasPrice),
      gasLimit: BigNumber.from(gasLimit),
    })
    await waitFor(async () => expect(closeModal).toBeCalled())
  })
})
