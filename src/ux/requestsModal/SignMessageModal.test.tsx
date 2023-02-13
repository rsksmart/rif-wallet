import { render, fireEvent } from '@testing-library/react-native'
import { SignMessageRequest } from '@rsksmart/rif-wallet-core'
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
