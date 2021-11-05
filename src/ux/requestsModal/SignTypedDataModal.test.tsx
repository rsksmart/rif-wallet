import React from 'react'
import { render } from '@testing-library/react-native'
import SignTypedDataModal from './SignTypedDataModal'
import { SignTypedDataRequest } from '../../lib/core'

describe('SignTypedData', function (this: {
  confirm: ReturnType<typeof jest.fn>
  cancel: ReturnType<typeof jest.fn>
  request: SignTypedDataRequest
}) {
  beforeEach(() => {
    this.confirm = jest.fn()
    this.cancel = jest.fn()

    // simple request, does not include types
    this.request = {
      type: 'signTypedData',
      returnType: '',
      payload: [
        {
          name: 'Testing',
        },
        {},
        {
          hello: 'world!',
          taco: 'tuesday',
        },
      ],
      confirm: () => {
        this.confirm
        return Promise.resolve()
      },
      reject: () => {
        this.cancel
        return Promise.reject()
      },
    } as SignTypedDataRequest
  })

  it('renders', () => {
    const { getAllByText } = render(
      <SignTypedDataModal request={this.request} closeModal={jest.fn()} />,
    )
    expect(getAllByText('Sign Typed Data').length).toBe(1)
  })

  it('displays a simple message', () => {
    const { getAllByTestId } = render(
      <SignTypedDataModal request={this.request} closeModal={jest.fn()} />,
    )

    expect(getAllByTestId('Formatter.Row').length).toBe(2)

    expect(getAllByTestId('Text.Heading')[0].children[0]).toBe('hello')
    expect(getAllByTestId('Text.Value')[0].children[0]).toBe('world!')
  })

  it('displays nested items', () => {
    this.request.payload[2] = {
      person: {
        name: 'tom',
        age: 21,
      },
      message: 'hello world!',
    }
    const { getAllByTestId, getAllByText } = render(
      <SignTypedDataModal request={this.request} closeModal={jest.fn()} />,
    )

    // does the content display
    expect(getAllByTestId('Formatter.Row')).toHaveLength(4)
    getAllByText('hello world!')
    getAllByText('person')
    getAllByText('21')
  })
})
