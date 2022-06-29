import {
  IAbiEnhancer,
  IEnhancedResult,
} from '@rsksmart/rif-wallet/packages/types'

export const enhancedTxTestCase: IEnhancedResult = {
  from: '0x6b4f72f48529d86a0f3ddf80f2c7291d16111850',
  to: '0xE85081d3cef23e0b1b664CE596D1BfA8D464e5f9',
  symbol: 'RIF',
  balance: 'balance',
  value: '32',
}

// @ts-ignore
export const createMockAbiEnhancer = (): IAbiEnhancer => ({
  // eslint-disable-next-line no-undef
  enhance: jest.fn(() => Promise.resolve(enhancedTxTestCase)),
})
