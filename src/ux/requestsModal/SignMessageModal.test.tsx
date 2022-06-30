import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { SignMessageRequest } from 'rif-wallet/packages/core'
import SignMessageModal from './SignMessageModal'

describe('SignMessageRequest', function (this: {
  confirm: ReturnType<typeof jest.fn>
  cancel: ReturnType<typeof jest.fn>
  request: SignMessageRequest
}) {
  beforeEach(() => {
    this.confirm = jest.fn()
    this.cancel = jest.fn()

    this.request = {
      type: 'signMessage',
      payload: 'Hello World!',
      confirm: this.confirm,
      reject: this.cancel,
    }
  })

  it('renders', () => {
    const { getAllByText, getByTestId } = render(
      <SignMessageModal request={this.request} closeModal={jest.fn()} />,
    )
    expect(getAllByText('Sign Message').length).toBe(2)
    expect(getByTestId('Text.Message').props.children).toBe('Hello World!')
  })

  it('handles confirm', () => {
    const { getByTestId } = render(
      <SignMessageModal request={this.request} closeModal={jest.fn()} />,
    )

    fireEvent.press(getByTestId('Button.Confirm'))
    expect(this.confirm).toBeCalledTimes(1)
  })

  it('handles reject', () => {
    const { getByTestId } = render(
      <SignMessageModal request={this.request} closeModal={jest.fn()} />,
    )

    fireEvent.press(getByTestId('Button.Reject'))
    expect(this.cancel).toBeCalledTimes(1)
  })
})
