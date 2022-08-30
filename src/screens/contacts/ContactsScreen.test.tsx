import { render } from '@testing-library/react-native'
import React from 'react'
import { ContactsContext, IContact } from './ContactsContext'
import { ContactsScreen } from './ContactsScreen'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}))

describe('ContactsScreen', () => {
  const navigationMock = { navigate: jest.fn() } as any
  let contactsContextMock: any
  const contactsMock: IContact[] = [
    {
      id: '1',
      name: 'Alice',
      address: '0x123',
      displayAddress: '0x123',
    },
    {
      id: '2',
      name: 'Bob',
      address: '0x456',
      displayAddress: '0x456',
    },
    {
      id: '3',
      name: 'Charlie',
      address: '0x789',
      displayAddress: '0x789',
    },
  ]

  beforeEach(() => {
    contactsContextMock = {
      contacts: [] as IContact[],
      deleteContact: jest.fn(),
    }
  })

  test('renders correctly with empty contacts', async () => {
    const { getByTestId } = render(
      <ContactsContext.Provider value={contactsContextMock}>
        <ContactsScreen navigation={navigationMock} />
      </ContactsContext.Provider>,
    )
    expect(getByTestId('emptyView')).toBeTruthy()
  })

  test('renders correctly with contacts', async () => {
    contactsContextMock.contacts = contactsMock
    const { getByText, getByTestId } = render(
      <ContactsContext.Provider value={contactsContextMock}>
        <ContactsScreen navigation={navigationMock} />
      </ContactsContext.Provider>,
    )

    expect(getByTestId('searchInput')).toBeTruthy()
    expect(getByText('Alice')).toBeTruthy()
    expect(getByText('Bob')).toBeTruthy()
    expect(getByText('Charlie')).toBeTruthy()
  })
})
