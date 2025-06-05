import { renderHook, act } from '@testing-library/react-native'
import { AppState, AppStateStatus } from 'react-native'

import { createReduxWrapper } from 'testLib/ReduxWrapper'

import { useStateSubscription } from './useStateSubscription'

// Mock react-native-background-timer if needed
jest.mock('react-native-background-timer', () => ({
  setTimeout: () => jest.fn().mockReturnValue(1),
  clearTimeout: jest.fn(),
}))

describe('hook: useStateSubscription', () => {
  let appStateCallback: (state: AppStateStatus) => void

  beforeEach(() => {
    // Mock AppState event handling
    jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation((event, callback) => {
        if (event === 'change') {
          appStateCallback = callback
        }
        return { remove: jest.fn() }
      })

    // clear mocks before each test
    jest.clearAllMocks()
  })

  test('test some different scenarios', async () => {
    const { result } = renderHook(() => useStateSubscription(), {
      wrapper: createReduxWrapper().ReduxWrapper,
    })

    // 1. initial state: simulate active app state
    act(() => {
      appStateCallback('active')
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
      appStateCallback('background')
    })
    expect(result.current.unlocked).toBeTruthy()
    expect(result.current.active).toBeFalsy()

    // 4. background -> active
    act(() => {
      appStateCallback('active')
    })
    expect(result.current.unlocked).toBeTruthy()
    expect(result.current.active).toBeTruthy()

    // 5. background again and lock the app
    act(() => {
      appStateCallback('background')
      result.current.setUnlocked(false)
    })
    expect(result.current.unlocked).toBeFalsy()
    expect(result.current.active).toBeFalsy()

    // 6. background -> active
    act(() => {
      appStateCallback('active')
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
