import { fireEvent, render } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import * as hooks from '../../subscriptions/RIFSockets'
import { ContactsContext, IContact } from './ContactsContext'
import { ContactsScreen } from './ContactsScreen'
import { ReduxWrapper } from '../../../testLib/ReduxWrapper'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}))

jest
  .spyOn(hooks, 'useSocketsState')
  .mockImplementation(() => ({ state: { balances: [{}] } } as any))

describe('ContactsScreen', () => {
  const navigationMock = { navigate: jest.fn() } as any
  let contactsContextMock: any
  const contactsMock: IContact[] = [
    {
      id: '1',
      name: 'Alice',
      address: '0x123A',
      displayAddress: '0x123A',
    },
    {
      id: '2',
      name: 'Bob',
      address: '0x456B',
      displayAddress: '0x456B',
    },
    {
      id: '3',
      name: 'Charlie',
      address: '0x789C',
      displayAddress: '0x789C',
    },
  ]

  beforeEach(() => {
    contactsContextMock = {
      contacts: [] as IContact[],
      deleteContact: jest.fn(),
    }
  })

  test('renders correctly with empty contacts', () => {
    const { getByTestId } = render(
      <ContactsContext.Provider value={contactsContextMock}>
        <ContactsScreen navigation={navigationMock} />
      </ContactsContext.Provider>,
      {
        wrapper: ReduxWrapper,
      },
    )
    expect(getByTestId('emptyView')).toBeTruthy()
  })

  test('renders correctly with contacts', () => {
    contactsContextMock.contacts = contactsMock
    const { getByText, getByTestId } = render(
      <ContactsContext.Provider value={contactsContextMock}>
        <ContactsScreen navigation={navigationMock} />
      </ContactsContext.Provider>,
      { wrapper: ReduxWrapper },
    )

    expect(getByTestId('searchInput')).toBeTruthy()
    expect(getByText('Alice')).toBeTruthy()
    expect(getByText('Bob')).toBeTruthy()
    expect(getByText('Charlie')).toBeTruthy()
  })

  test('search contact by name ignoring case sensitive', () => {
    contactsContextMock.contacts = contactsMock
    const { getByTestId, queryByText } = render(
      <ContactsContext.Provider value={contactsContextMock}>
        <ContactsScreen navigation={navigationMock} />
      </ContactsContext.Provider>,
      { wrapper: ReduxWrapper },
    )

    const searchInput = getByTestId('searchInput')
    act(() => {
      fireEvent.changeText(searchInput, 'alic')
    })

    expect(queryByText('Alice')).toBeTruthy()
    expect(queryByText('Bob')).toBeNull()
    expect(queryByText('Charlie')).toBeNull()
  })

  test('search contact by address ignoring case sensitive', () => {
    contactsContextMock.contacts = contactsMock
    const { getByTestId, queryByText } = render(
      <ContactsContext.Provider value={contactsContextMock}>
        <ContactsScreen navigation={navigationMock} />
      </ContactsContext.Provider>,
      { wrapper: ReduxWrapper },
    )

    const searchInput = getByTestId('searchInput')
    act(() => {
      fireEvent.changeText(searchInput, '0x123a')
    })

    expect(queryByText('Alice')).toBeTruthy()
    expect(queryByText('Bob')).toBeNull()
    expect(queryByText('Charlie')).toBeNull()
  })
})
