import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-test-renderer'
import { useKeyManagementSystem } from './useKeyManagementSystem'

describe('hook: useKeyManagementSystem', () => {
  test('renders the hook with default values', () => {
    const { result } = renderHook(() => useKeyManagementSystem(jest.fn))
    expect(result.current.state).toEqual({
      hasKeys: false,
      hasPin: false,
      kms: null,
      wallets: {},
      walletsIsDeployed: {},
      selectedWallet: '',
      loading: true,
      chainId: undefined,
    })
  })

  test('should createFirstWallet', async () => {
    const { result } = renderHook(() => useKeyManagementSystem(jest.fn))
    await act(async () => {
      const mnemonic =
        'output accident trust airport oven ethics gentle east comic connect foil mix gentle abuse drift amount track photo that churn chat'
      await result.current.createFirstWallet(mnemonic)
    })
    expect(result.current.state.hasKeys).toBeTruthy()
    expect(result.current.state.hasPin).toBeTruthy()
    expect(result.current.state.kms).toBeTruthy()
    expect(result.current.state.wallets).toBeTruthy()
    expect(result.current.state.walletsIsDeployed).toBeTruthy()
    expect(result.current.state.selectedWallet).toBeTruthy()
    expect(result.current.state.loading).toBeFalsy()
  })
})
