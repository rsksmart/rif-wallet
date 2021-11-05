import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'

import ReviewTransactionModal from './ReviewTransactionModal'
import { RIFWallet, SendTransactionRequest } from '../../lib/core/RIFWallet'
import { BigNumber } from '@ethersproject/bignumber'
import { setupTest } from '../../../testLib/setup'

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

    this.queuedTransaction = {
      type: 'sendTransaction',
      payload: [
        {
          to: '0x123',
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

  it('returns the initial transaction', () => {
    const closeModal = jest.fn()
    const { getByTestId } = render(
      <ReviewTransactionModal
        wallet={this.rifWallet}
        request={this.queuedTransaction}
        closeModal={closeModal}
      />,
    )
    fireEvent.press(getByTestId('Confirm.Button'))

    expect(this.confirm).toBeCalledWith({
      gasPrice: this.queuedTransaction.payload[0].gasPrice,
      gasLimit: this.queuedTransaction.payload[0].gasLimit,
    })
    expect(closeModal).toBeCalled()
  })

  it('renturns nothing if cancelled', () => {
    const closeModal = jest.fn()
    const { getByTestId } = render(
      <ReviewTransactionModal
        wallet={this.rifWallet}
        request={this.queuedTransaction}
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
        wallet={this.rifWallet}
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
    expect(closeModal).toHaveBeenCalled()
  })

  it('estimates gasLimit', async () => {
    const transaction = {
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
