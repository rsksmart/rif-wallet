import { formatTokenValue, formatFiatValue } from './index'

describe('formatFiatValue', () => {
  test('formats basic USD values correctly', () => {
    expect(formatFiatValue('5678.90')).toBe('$5,678.90')
    expect(formatFiatValue(1234567.89123)).toBe('$1,234,567.89')
    expect(formatFiatValue(1234567.89)).toBe('$1,234,567.89')
    expect(formatFiatValue(1234567)).toBe('$1,234,567.00')
    expect(formatFiatValue(1234.5)).toBe('$1,234.50')
    expect(formatFiatValue(1234)).toBe('$1,234.00')
  })

  test('handles zero as a special case', () => {
    expect(formatFiatValue(0)).toBe('$0.00')
    expect(formatFiatValue('0')).toBe('$0.00')
  })

  test('formats negative USD values correctly', () => {
    expect(formatFiatValue(-1234.56)).toBe('-$1,234.56')
  })

  test('rounds to two decimal places', () => {
    expect(formatFiatValue(1234.567)).toBe('$1,234.57')
  })

  test('small amounts', () => {
    expect(formatFiatValue(0.0000000099)).toBe('<$0.01')
    expect(formatFiatValue(0.009)).toBe('<$0.01')
    expect(formatFiatValue(0.0100000001)).toBe('$0.01')
    expect(formatFiatValue(0.01)).toBe('$0.01')
    expect(formatFiatValue(0.1)).toBe('$0.10')
  })
})

describe('formatTokenValue', () => {
  test('formats basic token values correctly', () => {
    expect(formatTokenValue('5678.901234')).toBe('5,678.901234')
    expect(formatTokenValue(1234)).toBe('1,234')
    expect(formatTokenValue(1234.5)).toBe('1,234.5')
    expect(formatTokenValue(1234.567890123)).toBe('1,234.56789012')
    expect(formatTokenValue(1234.567890005)).toBe('1,234.56789')
    expect(formatTokenValue(1234.5678900051)).toBe('1,234.56789001')
  })

  test('removes unnecessary trailing zeros', () => {
    expect(formatTokenValue('1234.5000')).toBe('1,234.5')
    expect(formatTokenValue('1234.50001')).toBe('1,234.50001')
  })

  test('handles zero as a special case', () => {
    expect(formatTokenValue(0)).toBe('0')
    expect(formatTokenValue('0')).toBe('0')
    expect(formatTokenValue('0.000000')).toBe('0')
  })

  test('formats very small token values correctly', () => {
    expect(formatTokenValue(0.0000000099)).toBe('<0.00000001')
    expect(formatTokenValue(0.000123)).toBe('0.000123')
  })

  test('formats negative token values correctly', () => {
    expect(formatTokenValue(-1234.56789)).toBe('-1,234.56789')
  })

  test('rounds to eight decimal places where applicable', () => {
    expect(formatTokenValue(1234.567890123)).toBe('1,234.56789012')
  })
})
