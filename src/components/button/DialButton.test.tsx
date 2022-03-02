import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { DialButton } from './DialButton'

describe('Dial Button', () => {
  test('renders correctly with defaults', () => {
    const onPress = jest.fn()
    const component = render(
      <DialButton testID="1" label="1" onPress={onPress} />,
    )
    const buttonNode = component.getByTestId('1')

    expect(component.getByText('1')).toBeDefined()
    expect(onPress).toBeCalledTimes(0)

    fireEvent.press(buttonNode)

    expect(onPress).toBeCalledTimes(1)
  })
})
