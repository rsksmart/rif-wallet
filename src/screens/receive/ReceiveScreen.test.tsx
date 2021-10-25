import React from 'react'

import mockClipboard from './clipboard-mock'

import { render, fireEvent, act } from '@testing-library/react-native'

import ReceiveScreen from './ReceiveScreen'

jest.mock('@react-native-community/clipboard', () => mockClipboard)

describe('ReceiveScreen', () => {
  const route = {
    params: {
      account: {
        smartWalletAddress: '0xbd4c8e11cf2c560382e0dbd6aeef538debf1d449',
      },
    },
  }

  it('remove', () => {
    expect(true).toBe(true)
  })

  it('renders', async () => {
    const { getAllByText } = render(<ReceiveScreen route={route} />)

    // make sure elements are showing up
    expect(getAllByText('copy').length).toBe(2)
    expect(getAllByText('share').length).toBe(1)
    expect(getAllByText(/0xbd4c\.\.\.d449/).length).toBe(1)
  })

  it('can copy address', () => {
    jest.useFakeTimers()

    const { getByTestId } = render(<ReceiveScreen route={route} />)

    act(() => {
      fireEvent.press(getByTestId('Copy.Account.Button'))

      expect(mockClipboard.setString).toBeCalledTimes(1)
    })
  })
})
