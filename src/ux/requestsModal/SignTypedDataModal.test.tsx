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
          name: 'Ether Mail',
          version: '1',
          chainId: 1,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          salt: '0xabcd',
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
    }
  })

  it('displays domain', () => {
    const { getByTestId } = render(
      <SignTypedDataModal request={this.request} closeModal={jest.fn()} />,
    )

    const domainNameFirstChild = getByTestId('Domain.Name').children[0]
    const domainVeriFyingContractFirstChild = getByTestId(
      'Domain.VerifyingContract',
    ).children[0]

    if (
      typeof domainNameFirstChild !== 'string' &&
      typeof domainVeriFyingContractFirstChild !== 'string'
    ) {
      expect(domainNameFirstChild._fiber.memoizedProps.children).toContain(
        this.request.payload[0].name,
      )
      expect(
        domainVeriFyingContractFirstChild._fiber.memoizedProps.children,
      ).toContain(this.request.payload[0].verifyingContract)
    }
  })

  it('displays nested items', () => {
    this.request.payload[2] = {
      person: {
        name: 'tom',
        age: 21,
      },
      message: 'hello world!',
    }
    const { getAllByText } = render(
      <SignTypedDataModal request={this.request} closeModal={jest.fn()} />,
    )

    // does the content display
    //expect(getAllByTestId('Formatter.Row')).toHaveLength(4)
    getAllByText('hello world!')
    getAllByText('person')
  })
})
