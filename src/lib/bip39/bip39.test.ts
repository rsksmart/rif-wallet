import {
  VALID_SEED_PHRASE,
  INVALID_WORD_SEED_PHRASE,
  SEED_PHRASE_TOO_SHORT,
} from './testCase'

import { validateMnemonic } from './index'

describe('Validate Mnemonic', () => {
  beforeEach(async () => {})

  test('mnemonic has invalid words', async () => {
    const error = validateMnemonic(INVALID_WORD_SEED_PHRASE)
    expect(error).toEqual('worldlist is not valid')
  })
  test('mnemonic is too short', async () => {
    const error = validateMnemonic(SEED_PHRASE_TOO_SHORT)
    expect(error).toEqual('you need to enter at least 12 words')
  })

  test('mnemonic is has valid words', async () => {
    const error = validateMnemonic(VALID_SEED_PHRASE)
    expect(error).toBeNull()
  })
})
