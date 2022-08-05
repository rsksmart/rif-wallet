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

  test('should switchActiveWallet', () => {
    const { result } = renderHook(() => useKeyManagementSystem(jest.fn))
    const { switchActiveWallet } = result.current

    act(() => {
      switchActiveWallet('0x123')
    })

    expect(result.current.state).toEqual({
      hasKeys: false,
      hasPin: false,
      kms: null,
      wallets: {},
      walletsIsDeployed: {},
      selectedWallet: '0x123',
      loading: true,
      chainId: undefined,
    })
  })
})
