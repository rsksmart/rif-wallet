import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import BaseButton from './BaseButton'

describe('BaseButton component', () => {
  const testID = 'button'

  test('renders children', () => {
    const component = render(
      <BaseButton testID={testID} onPress={() => {}}>
        <Text>copy</Text>
      </BaseButton>,
    )
    expect(component.getByTestId(testID)).toBeDefined()
  })

  test('calls function on press', () => {
    const onPress = jest.fn()
    const component = render(
      <BaseButton testID={testID} onPress={onPress}>
        <Text>copy</Text>
      </BaseButton>,
    )

    const buttonNode = component.getByTestId(testID)
    fireEvent.press(buttonNode)
    expect(onPress).toBeCalledTimes(1)
  })

  it('renders correctly with defaults', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <BaseButton onPress={onPress} testID="button">
        <Text>Hello</Text>
      </BaseButton>,
    )

    expect(getByTestId('button')).toBeDefined()

    fireEvent.press(getByTestId('button'))
    expect(onPress).toBeCalledTimes(1)
  })

  it('is not clickable when disabled', () => {
    const onPressDisabled = jest.fn()
    const { getByTestId } = render(
      <BaseButton onPress={onPressDisabled} testID="button" disabled={true}>
        <Text>Hello</Text>
      </BaseButton>,
    )

    expect(fireEvent.press(getByTestId('button'))).toBeUndefined()
    expect(onPressDisabled).toBeCalledTimes(0)
  })
})
