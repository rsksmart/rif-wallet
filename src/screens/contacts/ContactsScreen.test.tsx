import { fireEvent, render } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { Contact } from 'store/slices/contactsSlice/types'
import { ContactsListScreenProps, ContactsScreen } from './ContactsScreen'
import { createReduxWrapper } from '../../../testLib/ReduxWrapper'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('ContactsScreen', () => {
  const navigation = {
    navigation: jest.fn() as unknown as ContactsListScreenProps['navigation'],
    route: jest.fn() as unknown as ContactsListScreenProps['route'],
  }

  const contactsMock: Record<string, Contact> = {
    1: {
      id: '1',
      name: 'Alice',
      address: '0x123A',
      displayAddress: '0x123A',
    },
    2: {
      id: '2',
      name: 'Bob',
      address: '0x456B',
      displayAddress: '0x456B',
    },
    3: {
      id: '3',
      name: 'Charlie',
      address: '0x789C',
      displayAddress: '0x789C',
    },
  }

  describe('Test with Redux Implementation', () => {
    const { ReduxWrapper: wrapperWithEmptyContacts } = createReduxWrapper()
    test('renders correctly with empty contacts', () => {
      const { getByTestId } = render(
        <ContactsScreen
          navigation={navigation.navigation}
          route={navigation.route}
        />,
        {
          wrapper: wrapperWithEmptyContacts,
        },
      )
      expect(getByTestId('emptyView')).toBeTruthy()
    })

    const { ReduxWrapper: wrapperWithContacts } = createReduxWrapper({
      contacts: {
        contacts: contactsMock,
      },
    })
    test('renders correctly with contacts', () => {
      const { getByText, getByTestId } = render(
        <ContactsScreen
          navigation={navigation.navigation}
          route={navigation.route}
        />,
        { wrapper: wrapperWithContacts },
      )

      expect(getByTestId('searchInput')).toBeTruthy()
      expect(getByText('Alice')).toBeTruthy()
      expect(getByText('Bob')).toBeTruthy()
      expect(getByText('Charlie')).toBeTruthy()
    })

    test('search contact by name ignoring case sensitive', () => {
      const { getByTestId, queryByText } = render(
        <ContactsScreen
          navigation={navigation.navigation}
          route={navigation.route}
        />,
        { wrapper: wrapperWithContacts },
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
      const { getByTestId, queryByText } = render(
        <ContactsScreen
          navigation={navigation.navigation}
          route={navigation.route}
        />,
        { wrapper: wrapperWithContacts },
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
})
