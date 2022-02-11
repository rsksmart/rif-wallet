/* eslint-disable */
/*
import BackgroundStateManager, {
  AvailableStates,
} from '../backgroundStateManager'

const keyStore = require('./storage/KeyStore')
const PINStore = require('./storage/PinStore')
*/
describe.skip('BackgroundStateManager', () => {
  test('', () => {})
  /*
  beforeAll(() => {
    jest.spyOn(keyStore, 'hasKeys').mockResolvedValue(true)
    jest.spyOn(PINStore, 'hasPin').mockResolvedValue(true)
  })

  it('shows locked when there is a Pin', async () => {
    const changeStateFn = jest.fn()
    const apm = new BackgroundStateManager(changeStateFn, jest.fn(), jest.fn())
    expect(apm.currentState).toBe(AvailableStates.LOADING)

    await apm.appIsActive()
    expect(changeStateFn).toBeCalledWith('LOCKED')
  })

  it('shows ready when there is no key', async () => {
    jest.spyOn(keyStore, 'hasKeys').mockResolvedValue(false)

    const changeStateFn = jest.fn()
    const apm = new BackgroundStateManager(changeStateFn, jest.fn(), jest.fn())

    await apm.appIsActive()
    expect(changeStateFn).toBeCalledWith(AvailableStates.READY)
  })

  it('moves to background', async () => {
    const changeStateFn = jest.fn()
    const apm = new BackgroundStateManager(changeStateFn, jest.fn(), jest.fn())

    await apm.handleAppStateChange('inactive')
    expect(changeStateFn).toBeCalledWith(AvailableStates.BACKGROUND)
  })

  it('moves to the foregroud in grace period', async () => {
    const changeStateFn = jest.fn()
    const apm = new BackgroundStateManager(changeStateFn, jest.fn(), jest.fn())

    await apm.handleAppStateChange('inactive')
    await apm.handleAppStateChange('active')
    expect(changeStateFn).toBeCalledWith(AvailableStates.READY)
  })

  it('locks the app if timer expires', async () => {
    jest.useFakeTimers()

    const changeStateFn = jest.fn()
    const resetStateFn = jest.fn()
    const apm = new BackgroundStateManager(
      changeStateFn,
      jest.fn(),
      resetStateFn,
    )

    await apm.handleAppStateChange('inactive')
    await jest.runOnlyPendingTimers()
    expect(changeStateFn).toBeCalledWith(AvailableStates.BACKGROUND_LOCKED)
    expect(resetStateFn).toBeCalled()
  })
  */
})
