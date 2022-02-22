import React from 'react'
import { render, fireEvent, RenderAPI } from '@testing-library/react-native'
import { BaseButton } from 'react-native-gesture-handler'
import { Text } from 'react-native'

describe('BaseButton component', () => {
  let component: RenderAPI
  const testID = 'copy'
  const onPress = jest.fn()

  beforeEach(() => {
    component = render(
      <BaseButton testID={testID} onPress={onPress}>
        <Text>copy</Text>
      </BaseButton>,
    )
  })

  test('renders component without children', () => {
    const { getByTestId } = render(
      <BaseButton testID={testID} onPress={onPress} />,
    )
    expect(getByTestId(testID).children.length).toEqual(0)
  })

  test('renders children', () => {
    expect(component.getByTestId(testID)).toBeDefined()
    expect(component.getByTestId(testID).children.length).toEqual(1)
  })

  test('calls function on press', () => {
    const buttonNode = component.getByTestId(testID)
    fireEvent.press(buttonNode)
    expect(onPress).toBeCalledTimes(1)
  })
})
