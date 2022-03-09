import React from 'react'
import { render, fireEvent, RenderAPI } from '@testing-library/react-native'
import { KeyPad } from './index'

describe('KeyPad component', () => {
  const onKeyPress = jest.fn()
  const onDelete = jest.fn()
  const onUnlock = jest.fn()
  let component: RenderAPI

  beforeEach(() => {
    component = render(
      <KeyPad
        onDelete={onDelete}
        onKeyPress={onKeyPress}
        onUnlock={onUnlock}
      />,
    )
  })

  test('fires onKeyPress on number', () => {
    const numberNode = component.getByTestId('1')
    expect(onKeyPress).toBeCalledTimes(0)
    fireEvent.press(numberNode)
    expect(onKeyPress).toBeCalledTimes(1)
  })

  test('fires onDelete on number', () => {
    const deleteNode = component.getByTestId('DEL')
    expect(onDelete).toBeCalledTimes(0)
    fireEvent.press(deleteNode)
    expect(onDelete).toBeCalledTimes(1)
  })

  test('fires onUnlock on number', () => {
    const okNode = component.getByTestId('OK')
    expect(onUnlock).toBeCalledTimes(0)
    fireEvent.press(okNode)
    expect(onUnlock).toBeCalledTimes(1)
  })
})
