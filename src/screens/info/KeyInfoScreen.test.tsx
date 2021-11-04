import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { KeysInfoScreen, TestID } from './KeysInfoScreen'
import { setupTest } from '../../../testLib/setup'
import { Awaited, getTextFromTextNode } from '../../../testLib/utils'
import { AppContext } from '../../Context'

const createTestInstance = async () => {
  const { rifWallet } = await setupTest()
  const testMnemonic = 'MNEMONIC'
  const deleteKeys = jest.fn()

  const container = render(
    <AppContext.Provider
      value={{
        wallets: { [rifWallet.address]: rifWallet },
        setRequests: (() => {}) as any,
        mnemonic: 'MNEMONIC',
        selectedWallet: rifWallet.address,
      }}>
      <KeysInfoScreen mnemonic={testMnemonic} deleteKeys={deleteKeys} />
    </AppContext.Provider>,
  )

  return { container, rifWallet, testMnemonic, deleteKeys }
}

describe('Keys Info Screen', function (this: {
  testInstance: Awaited<ReturnType<typeof createTestInstance>>
}) {
  beforeEach(async () => {
    this.testInstance = await createTestInstance()
  })
  describe('initial screen', () => {
    test('shows mnemonic', async () => {
      const {
        container: { getByTestId },
        testMnemonic,
      } = this.testInstance

      expect(getTextFromTextNode(getByTestId(TestID.Mnemonic))).toEqual(
        testMnemonic,
      )
    })
  })

  describe('actions', () => {
    test('delete keys', () => {
      const {
        container: { getByTestId },
        deleteKeys,
      } = this.testInstance

      fireEvent.press(getByTestId(TestID.Delete))

      expect(deleteKeys).toHaveBeenCalledTimes(1)
    })
  })
})
