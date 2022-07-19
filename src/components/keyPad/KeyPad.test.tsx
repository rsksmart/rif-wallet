import React from 'react'
import { render, fireEvent, RenderAPI } from '@testing-library/react-native'
import { KeyPad } from './index'

describe('KeyPad component', () => {
  const onDelete = jest.fn()
  const onKeyPress = jest.fn()

  let component: RenderAPI

  beforeEach(() => {
    component = render(<KeyPad onDelete={onDelete} onKeyPress={onKeyPress} />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('fires onKeyPress on number', () => {
    const numberNode = component.getByTestId('keypad_1')
    expect(onKeyPress).toBeCalledTimes(0)
    fireEvent.press(numberNode)
    expect(onKeyPress).toBeCalledTimes(1)
  })

  test('presses 0 and 2 keypad numbers', () => {
    const zeroNode = component.getByTestId('keypad_0')
    const secondNode = component.getByTestId('keypad_2')
    expect(onKeyPress).toBeCalledTimes(0)
    fireEvent.press(zeroNode)
    expect(onKeyPress).toBeCalledTimes(1)
    fireEvent.press(secondNode)
    expect(onKeyPress).toBeCalledTimes(2)
  })

  test('fires onDelete on number', () => {
    const deleteNode = component.getByTestId('keypad_DEL')
    expect(onDelete).toBeCalledTimes(0)
    fireEvent.press(deleteNode)
    expect(onDelete).toBeCalledTimes(1)
  })
})
