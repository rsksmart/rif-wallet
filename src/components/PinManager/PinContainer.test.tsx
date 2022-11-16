import { render, fireEvent, RenderAPI } from '@testing-library/react-native'
import { PinContainer } from './PinContainer'
import { pinLength } from '../../shared/costants'

describe('PinContainer test', () => {
  let pinResult: string
  const onPinSubmit = jest.fn(
    pin =>
      new Promise(res => {
        pinResult = pin
        res(pin)
      }),
  )
  let component: RenderAPI
  const getStaticKeypadNumberNodes = (curComponent: RenderAPI, length = 4) =>
    Array.from(Array(length), (_, i) => curComponent.getByTestId(`keypad_${i}`))
  beforeEach(() => {
    jest.clearAllMocks()
    component = render(
      <PinContainer pinLength={pinLength} onPinSubmit={onPinSubmit} />,
    )
  })
  test('should not submit the pin after 3 digits press', () => {
    const keypadNodes = getStaticKeypadNumberNodes(component, 3)
    for (const keypadNode of keypadNodes) {
      fireEvent.press(keypadNode)
    }
    expect(onPinSubmit).toBeCalledTimes(0)
  })
  test('should submit the pin after 4 digits press', () => {
    const keypadNodes = getStaticKeypadNumberNodes(component)
    for (const keypadNode of keypadNodes) {
      fireEvent.press(keypadNode)
    }
    expect(onPinSubmit).toBeCalledTimes(1)
  })

  test('pinSubmit length to be greater than 0', () => {
    expect(pinResult.length).toBeGreaterThan(0)
  })

  test('pinSubmit length to be equal to 4', () => {
    expect(pinResult.length).toBe(4)
  })

  test('should submit the pin after 6 digits press', () => {
    const componentSix = render(
      <PinContainer pinLength={6} onPinSubmit={onPinSubmit} />,
    )
    const keypadNodes = getStaticKeypadNumberNodes(componentSix, 6)
    for (const keypadNode of keypadNodes) {
      fireEvent.press(keypadNode)
    }
    expect(onPinSubmit).toBeCalledTimes(1)
  })

  test('pinSubmit length to be equal to 6', () => {
    expect(pinResult.length).toBe(6)
  })
})
