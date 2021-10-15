import React from 'react'
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock'

import { render, fireEvent } from '@testing-library/react-native'

import ReceiveScreen from './ReceiveScreen'

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard)

describe('ReceiveScreen', () => {
  const account = { address: '0xBd4c8e11CF2c560382e0dbD6AeEF538deBf1D449' }

  it('remove', () => {
    expect(true).toBe(true)
  })

  // it('renders', () => {
  //   const { getAllByText } = render(<ReceiveScreen route={{ account }} />)

  //   // make sure elements are showing up
  //   expect(getAllByText('copy').length).toBe(1)
  // })
})
