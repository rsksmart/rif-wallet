import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { ContactFormScreen } from './ContactFormScreen'

describe('ContactFormScreen', () => {
  const navigationMock = { navigate: jest.fn() } as any
  const routeMock = { params: { contact: undefined } } as any
  const chainId = 31

  test('create contact form', async () => {
    const { getByTestId, getByText } = render(
      <ContactFormScreen
        navigation={navigationMock}
        route={routeMock}
        chainId={chainId}
      />,
    )
    expect(getByText('Create Contact')).toBeTruthy()
    expect(getByTestId('nameInput').props.value).toBe('')
    expect(getByTestId('addressInput').props.value).toBe('')
    expect(getByTestId('saveButton')).toBeTruthy()
  })

  test('edit contact form', async () => {
    routeMock.params.initialValue = {
      id: '1',
      name: 'Alice',
      address: '0x123',
      displayAddress: '0x123',
    }
    const { getByTestId, getByText } = render(
      <ContactFormScreen
        navigation={navigationMock}
        route={routeMock}
        chainId={chainId}
      />,
    )
    expect(getByText('Edit Contact')).toBeTruthy()
    expect(getByTestId('nameInput').props.value).toBe('Alice')
    expect(getByTestId('addressInput').props.value).toBe('0x123')
  })

  test('save contact', async () => {
    const { getByTestId } = render(
      <ContactFormScreen
        navigation={navigationMock}
        route={routeMock}
        chainId={chainId}
      />,
    )
    fireEvent.changeText(getByTestId('nameInput'), 'Alice')
    fireEvent.changeText(
      getByTestId('addressInput'),
      '0xA2193A393AA0C94a4d52893496F02B56c61C36a1',
    )
    fireEvent.press(getByTestId('saveButton'))
    expect(navigationMock.navigate).toHaveBeenCalledWith('ContactsList')
  })
})
