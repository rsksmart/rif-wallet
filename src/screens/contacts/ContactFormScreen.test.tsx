import { useNavigation } from '@react-navigation/native'
import { render, fireEvent } from '@testing-library/react-native'
import { ContactFormScreen, ContactFormScreenProps } from './ContactFormScreen'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => {
    return jest.fn()
  },
}))

describe('ContactFormScreen', () => {
  const { navigation } = useNavigation<ContactFormScreenProps>()
  const route = {
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
    )
    expect(getByText('Create Contact')).toBeTruthy()
    expect(getByTestId('nameInput').props.value).toBe('')
    expect(getByTestId('addressInput').props.value).toBe('')
    expect(getByTestId('saveButton')).toBeTruthy()
  })

  test('edit contact form', async () => {
    const mockRoute = {
      params: {
        initialValue: {
          id: '1',
          name: 'Alice',
          address: '0x123',
          displayAddress: '0x123',
        },
      },
    }

    const { getByTestId, getByText } = render(
      <ContactFormScreen navigation={navigation} route={mockRoute} />,
    )
    expect(getByText('Edit Contact')).toBeTruthy()
    expect(getByTestId('nameInput').props.value).toBe('Alice')
    expect(getByTestId('addressInput').props.value).toBe('0x123')
  })

  test('save contact', async () => {
    const navigate = jest.fn()
    const mockNavigation = { ...navigation, navigate }
    const { getByTestId } = render(
      <ContactFormScreen navigation={mockNavigation} route={route} />,
    )
    fireEvent.changeText(getByTestId('nameInput'), 'Alice')
    fireEvent.changeText(
      getByTestId('addressInput'),
      '0xA2193A393AA0C94a4d52893496F02B56c61C36a1',
    )
    fireEvent.press(getByTestId('saveButton'))
    expect(navigate).toHaveBeenCalledWith('ContactsList')
  })
})
