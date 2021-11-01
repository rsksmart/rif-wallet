import React from 'react'
import { render, fireEvent } from "@testing-library/react-native"
import { KeysInfoScreen } from ".."
import { setupTest } from "../../../testLib/setup"
import { createNewTestWallet, getTextFromTextNode } from "../../../testLib/utils"
import { AppContext } from "../../Context"
import { deleteKeys } from '../../storage/KeyStore'

const createTestInstance = async () => {
  const { rifWallet } = await setupTest()
  const testMnemonic = 'MNEMONIC'
  const deleteKeys = jest.fn()

  const container = render(<AppContext.Provider value={{
    wallets: { [rifWallet.address]: rifWallet },
    setRequests: (() => {}) as any,
    mnemonic: 'MNEMONIC',
    selectedWallet: rifWallet.address
  }}>
    <KeysInfoScreen mnemonic={testMnemonic} deleteKeys={deleteKeys} />
  </AppContext.Provider>)

  return { container, rifWallet, testMnemonic, deleteKeys }
}

describe('keys info', () => {
  describe('initial screen', () => {
    test('shows mnemonic', async () => {
      const { container: { getByTestId }, testMnemonic } = await createTestInstance()

      expect(getTextFromTextNode(getByTestId('Mnemonic.Text'))).toEqual(testMnemonic)
    })
  })

  describe('actions', () => {
    test('delete keys', async () => {
      const { container: { getByTestId }, deleteKeys } = await createTestInstance()

      fireEvent.press(getByTestId('Delete.Button'))

      expect(deleteKeys).toHaveBeenCalledTimes(1)
    })
  })
})
