import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'

import ReviewTransactionModal from './ReviewTransactionModal'
import { Transaction } from '@rsksmart/rlogin-eip1193-types'

describe('ReviewTransactionModal', () => {
  const transaction: Transaction = {
    to: '0x123',
    from: '0x456',
    data: '',
    value: 1000,
    gasLimit: 10000,
    gasPrice: 0.068,
  }

  it('renders', () => {
    const { getAllByText, getByPlaceholderText } = render(
      <ReviewTransactionModal
        transaction={transaction}
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
        transaction={transaction}
        closeModal={closeModal}
      />,
    )
    fireEvent.press(getByTestId('Confirm.Button'))
    expect(closeModal).toBeCalledWith(transaction)
  })

  it('renturns nothing if cancelled', () => {
    const closeModal = jest.fn()
    const { getByTestId } = render(
      <ReviewTransactionModal
        transaction={transaction}
        closeModal={closeModal}
      />,
    )

    fireEvent.press(getByTestId('Cancel.Button'))
    expect(closeModal).toBeCalledWith(null)
  })

  it('allows the user to change the text inputs', () => {
    const closeModal = jest.fn()
    const { getByTestId } = render(
      <ReviewTransactionModal
        transaction={transaction}
        closeModal={closeModal}
      />,
    )

    fireEvent.changeText(getByTestId('gasLimit.TextInput'), '20')
    fireEvent.changeText(getByTestId('gasPrice.TextInput'), '0.123')

    fireEvent.press(getByTestId('Confirm.Button'))
    expect(closeModal).toBeCalledWith({
      ...transaction,
      gasLimit: 20,
      gasPrice: 0.123,
    })
  })
})
