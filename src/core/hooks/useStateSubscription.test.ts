import { renderHook } from '@testing-library/react-hooks'
import { AppState } from 'react-native'
import { act } from 'react-test-renderer'
import { useStateSubscription } from './useStateSubscription'

describe('hook: useStateSubscription', () => {
  let result: any
  let appStateSpy: jest.SpyInstance
  beforeEach(() => {
    ;({ result } = renderHook(() => useStateSubscription()))
    appStateSpy = jest.spyOn(AppState, 'addEventListener')
  })

  test('renders the hook with default values', () => {
    act(() => {
      appStateSpy.mock.calls[0][1]('active')
    })

    expect(result.current.unlocked).toBeFalsy()
    expect(result.current.active).toBeTruthy()
  })

  test('should change unlocked to true', () => {
    act(() => {
      appStateSpy.mock.calls[0][1]('active')
      result.current.setUnlocked(true)
    })

    expect(result.current.unlocked).toBeTruthy()
    expect(result.current.active).toBeTruthy()
  })

  test('should change active to false after app goes to background', () => {
    act(() => {
      appStateSpy.mock.calls[0][1]('background')
    })

    expect(result.current.unlocked).toBeFalsy()
    expect(result.current.active).toBeFalsy()
  })
})
