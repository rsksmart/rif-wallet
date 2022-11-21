import { useNavigation } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
// import * as hooks from '../../subscriptions/RIFSockets'
import {
  ContactsContext,
  ContactsContextInterface,
  IContact,
} from './ContactsContext'
import { ContactsListScreenProps, ContactsScreen } from './ContactsScreen'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

// jest.spyOn(hooks, 'useSocketsState').mockImplementation(() => ({
//   state: { balances: [{}] },
//   dispatch: () => {},
// }))

describe('ContactsScreen', () => {
  const navigation = useNavigation<ContactsListScreenProps>()
  let contactsContextMock: ContactsContextInterface
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
      contacts: [],
      deleteContact: jest.fn(),
      addContact: jest.fn(),
      isLoading: false,
      editContact: jest.fn(),
    }
  })

  test('renders correctly with empty contacts', () => {
    const { getByTestId } = render(
      <ContactsContext.Provider value={contactsContextMock}>
        <ContactsScreen
          navigation={navigation.navigation}
          route={navigation.route}
        />
      </ContactsContext.Provider>,
    )
    expect(getByTestId('emptyView')).toBeTruthy()
  })

  test('renders correctly with contacts', () => {
    contactsContextMock.contacts = contactsMock
    const { getByText, getByTestId } = render(
      <ContactsContext.Provider value={contactsContextMock}>
        <ContactsScreen
          navigation={navigation.navigation}
          route={navigation.route}
        />
      </ContactsContext.Provider>,
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
        <ContactsScreen
          navigation={navigation.navigation}
          route={navigation.route}
        />
      </ContactsContext.Provider>,
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
        <ContactsScreen
          navigation={navigation.navigation}
          route={navigation.route}
        />
      </ContactsContext.Provider>,
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
