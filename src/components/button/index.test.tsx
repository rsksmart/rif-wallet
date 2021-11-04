import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from './index'

describe('button', () => {
  it('renders correctly with defaults', () => {
    const onPress = jest.fn()
    const { getByText } = render(<Button title="hello" onPress={onPress} />)

    expect(getByText('hello')).toBeDefined()

    fireEvent.press(getByText('hello'))
    expect(onPress).toBeCalledTimes(1)
  })
})
