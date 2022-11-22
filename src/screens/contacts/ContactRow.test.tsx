import { fireEvent, render } from '@testing-library/react-native'
import { ContactRow } from './ContactRow'
import { IContact } from './ContactsContext'
import { ReduxWrapper } from '../../../testLib/ReduxWrapper'
import * as balancesSelectors from 'store/slices/balancesSlice/selectors'

jest.spyOn(balancesSelectors, 'selectBalances').mockImplementation(() => ({
  test: {
    balance: '10',
    name: 'test',
    logo: 'test',
    symbol: 'test',
    contractAddress: '',
    decimals: 18,
  },
}))

describe('ContactRow', () => {
  const contact: IContact = {
    id: '1',
    name: 'Alice',
    address: '0x123',
    displayAddress: '0x123',
  }
  test('renders correctly', () => {
    const { getByText } = render(
      <ContactRow
        index={0}
        contact={contact}
        selected={false}
        onSend={jest.fn}
        onDelete={jest.fn}
        onEdit={jest.fn}
        onPress={jest.fn}
      />,
      { wrapper: ReduxWrapper },
    )
    expect(getByText('Alice')).toBeTruthy()
  })

  test('press contact card without action buttons', () => {
    const onPress = jest.fn()
    const component = render(
      <ContactRow
        index={0}
        contact={contact}
        selected={false}
        onSend={jest.fn}
        onDelete={jest.fn}
        onEdit={jest.fn}
        onPress={onPress}
      />,
      { wrapper: ReduxWrapper },
    )
    const { getByTestId, queryByTestId } = component

    expect(queryByTestId('sendButton-0')).toBeNull()
    expect(queryByTestId('deleteButton-0')).toBeNull()
    expect(queryByTestId('editButton-0')).toBeNull()

    expect(onPress).toBeCalledTimes(0)
    fireEvent.press(getByTestId('contactCard-0'))
    expect(onPress).toBeCalledTimes(1)
  })

  test('press action buttons', () => {
    const onSend = jest.fn()
    const onDelete = jest.fn()
    const onEdit = jest.fn()
    const component = render(
      <ContactRow
        index={0}
        contact={contact}
        selected={true}
        onSend={onSend}
        onDelete={onDelete}
        onEdit={onEdit}
        onPress={jest.fn}
      />,
      { wrapper: ReduxWrapper },
    )
    const { getByTestId, queryByTestId } = component

    expect(queryByTestId('sendButton-0')).not.toBeNull()
    expect(queryByTestId('deleteButton-0')).not.toBeNull()
    expect(queryByTestId('editButton-0')).not.toBeNull()

    expect(onSend).toBeCalledTimes(0)
    fireEvent.press(getByTestId('sendButton-0'))
    expect(onSend).toBeCalledTimes(1)

    expect(onDelete).toBeCalledTimes(0)
    fireEvent.press(getByTestId('deleteButton-0'))
    expect(onDelete).toBeCalledTimes(1)

    expect(onEdit).toBeCalledTimes(0)
    fireEvent.press(getByTestId('editButton-0'))
    expect(onEdit).toBeCalledTimes(1)
  })

  test('user does not have any balance, so send button should be hidden', () => {
    jest
      .spyOn(balancesSelectors, 'selectBalances')
      .mockImplementation(() => ({}))

    const onSend = jest.fn()
    const onDelete = jest.fn()
    const onEdit = jest.fn()
    const component = render(
      <ContactRow
        index={0}
        contact={contact}
        selected={true}
        onSend={onSend}
        onDelete={onDelete}
        onEdit={onEdit}
        onPress={jest.fn}
      />,
      { wrapper: ReduxWrapper },
    )
    const { getByTestId, queryByTestId } = component

    expect(queryByTestId('sendButton-0')).toBeNull()
    expect(queryByTestId('deleteButton-0')).not.toBeNull()
    expect(queryByTestId('editButton-0')).not.toBeNull()

    expect(onDelete).toBeCalledTimes(0)
    fireEvent.press(getByTestId('deleteButton-0'))
    expect(onDelete).toBeCalledTimes(1)

    expect(onEdit).toBeCalledTimes(0)
    fireEvent.press(getByTestId('editButton-0'))
    expect(onEdit).toBeCalledTimes(1)
  })
})
