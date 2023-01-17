import { renderHook } from '@testing-library/react-hooks'
import { AppState } from 'react-native'
import { act } from 'react-test-renderer'

import { createReduxWrapper } from 'testLib/ReduxWrapper'
import { useStateSubscription } from './useStateSubscription'

describe('hook: useStateSubscription', () => {
  test('test some different scenarios', () => {
    const appStateSpy = jest.spyOn(AppState, 'addEventListener')
    const { result } = renderHook(() => useStateSubscription(), {
      wrapper: createReduxWrapper().ReduxWrapper,
    })

    // 1. initial state
    act(() => {
      appStateSpy.mock.calls[0][1]('active')
    })
    expect(result.current.unlocked).toBeFalsy()
    expect(result.current.active).toBeTruthy()

    // 2. unlock the app
    act(() => {
      result.current.setUnlocked(true)
    })
    expect(result.current.unlocked).toBeTruthy()
    expect(result.current.active).toBeTruthy()

    // 3. put the app to background
    act(() => {
      appStateSpy.mock.calls[0][1]('background')
    })
    expect(result.current.unlocked).toBeTruthy()
    expect(result.current.active).toBeFalsy()

    // 4. background -> active
    act(() => {
      appStateSpy.mock.calls[0][1]('active')
    })
    expect(result.current.unlocked).toBeTruthy()
    expect(result.current.active).toBeTruthy()

    // 5. put the app to background again and lock it
    act(() => {
      appStateSpy.mock.calls[0][1]('background')
      result.current.setUnlocked(false)
    })
    expect(result.current.unlocked).toBeFalsy()
    expect(result.current.active).toBeFalsy()

    // 6. background -> active
    act(() => {
      appStateSpy.mock.calls[0][1]('active')
    })
    expect(result.current.unlocked).toBeFalsy()
    expect(result.current.active).toBeTruthy()

    // 7. unlock the app
    act(() => {
      result.current.setUnlocked(true)
    })
    expect(result.current.unlocked).toBeTruthy()
    expect(result.current.active).toBeTruthy()
  })
})
