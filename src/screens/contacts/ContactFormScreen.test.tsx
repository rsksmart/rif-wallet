import { useNavigation } from '@react-navigation/native'
import { render, fireEvent } from '@testing-library/react-native'
import { ContactFormScreen, ContactFormScreenProps } from './ContactFormScreen'
import { createReduxWrapper } from 'testLib/ReduxWrapper'
import { contactsStackRouteNames } from 'src/navigation/contactsNavigator'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}))

describe('ContactFormScreen', () => {
  const { ReduxWrapper } = createReduxWrapper()

  const navigation = useNavigation<ContactFormScreenProps['navigation']>()
  const route: Readonly<{
    key: string
    name: contactsStackRouteNames.ContactForm
    path: string
  }> & {
    params: {
      initialValue: {
        id: string
        name: string
        address: string
        displayAddress: string
      }
    }
  } = {
    key: '',
    name: contactsStackRouteNames.ContactForm,
    path: 'smth/smth',
    params: {
      initialValue: {
        id: '',
        name: '',
        address: '',
        displayAddress: '',
      },
    },
  }

  test('create contact form', async () => {
    const { getByTestId, getByText } = render(
      <ContactFormScreen navigation={navigation} route={route} />,
      { wrapper: ReduxWrapper },
    )
    expect(getByText('Create Contact')).toBeTruthy()
    expect(getByTestId('nameInput').props.value).toBe('')
    expect(getByTestId('addressInput').props.value).toBe('')
    expect(getByTestId('saveButton')).toBeTruthy()
  })

  test('edit contact form', async () => {
    route.params.initialValue = {
      id: '1',
      name: 'Alice',
      address: '0x123',
      displayAddress: '0x123',
    }

    const { getByTestId, getByText } = render(
      <ContactFormScreen navigation={navigation} route={route} />,
      { wrapper: ReduxWrapper },
    )
    expect(getByText('Edit Contact')).toBeTruthy()
    expect(getByTestId('nameInput').props.value).toBe('Alice')
    expect(getByTestId('addressInput').props.value).toBe('0x123')
  })

  test('save contact', async () => {
    const { getByTestId } = render(
      <ContactFormScreen navigation={navigation} route={route} />,
      { wrapper: ReduxWrapper },
    )
    fireEvent.changeText(getByTestId('nameInput'), 'Alice')
    fireEvent.changeText(
      getByTestId('addressInput'),
      '0xA2193A393AA0C94a4d52893496F02B56c61C36a1',
    )
    fireEvent.press(getByTestId('saveButton'))
    expect(navigation.navigate).toHaveBeenCalledWith('ContactsList')
  })
})
