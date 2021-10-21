import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'

import ReviewTransactionModal from './ReviewTransactionModal'
import { Request } from '../lib/core/RIFWallet'

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
          value: 1000,
          gasLimit: 10000,
          gasPrice: 0.068,
        },
      },
      confirm: this.confirm,
      reject: this.cancel,
    }
  })

  it('renders', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <ReviewTransactionModal
        queuedTransactionRequest={this.queuedTransaction}
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
        queuedTransactionRequest={this.queuedTransaction}
        closeModal={closeModal}
      />,
    )
    fireEvent.press(getByTestId('Confirm.Button'))
    expect(this.confirm).toBeCalledWith(
      this.queuedTransaction.payload.transactionRequest,
    )
    expect(closeModal).toBeCalled()
  })

  it('renturns nothing if cancelled', () => {
    const closeModal = jest.fn()
    const { getByTestId } = render(
      <ReviewTransactionModal
        queuedTransactionRequest={this.queuedTransaction}
        closeModal={closeModal}
      />,
    )

    fireEvent.press(getByTestId('Cancel.Button'))
    expect(this.cancel).toBeCalled()
    expect(closeModal).toBeCalled()
  })

  it('allows the user to change the text inputs', () => {
    const closeModal = jest.fn()
    const { getByTestId } = render(
      <ReviewTransactionModal
        queuedTransactionRequest={this.queuedTransaction}
        closeModal={closeModal}
      />,
    )

    fireEvent.changeText(getByTestId('gasLimit.TextInput'), '20')
    fireEvent.changeText(getByTestId('gasPrice.TextInput'), '1000')

    fireEvent.press(getByTestId('Confirm.Button'))
    expect(closeModal).toBeCalled()

    expect(this.confirm).toBeCalledWith({
      ...this.queuedTransaction.payload.transactionRequest,
      gasLimit: 20,
      gasPrice: 1000,
    })
  })
})
