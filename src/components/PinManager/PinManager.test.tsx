import React from 'react'
import { fireEvent, render, RenderAPI } from '@testing-library/react-native'
import { PinManager } from './index'

describe('Pin Manager test', () => {
  let component: RenderAPI
  const titleMock = 'test'
  const onSubmit = jest.fn(
    () =>
      new Promise(res => {
        res()
      }),
  )
  beforeEach(() => {
    component = render(<PinManager title={titleMock} handleSubmit={onSubmit} />)
  })

  test(`should render the PinManager with title ${titleMock}`, () => {
    const viewNode = component.getByTestId('messageComponentView')
    expect(viewNode).toBeTruthy()

    const textNode = component.getByTestId('messageTextComponent')
    expect(textNode).toBeTruthy()
    expect(textNode.props.children).toBe(titleMock)
  })

  test('submit should be called once', () => {
    const keyPad = component.getByTestId('keypad_0')
    for (let i = 0; i <= 3; i++) {
      fireEvent.press(keyPad)
    }
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
