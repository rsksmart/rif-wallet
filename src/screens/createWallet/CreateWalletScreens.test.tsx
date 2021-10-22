import React from 'react'

import { render, fireEvent, waitFor } from '@testing-library/react-native'

import CreateMasterKeyScreen from './CreateMasterKeyScreen'
import ConfirmMasterKeyScreen from './ConfirmMasterKeyScreen'
import WalletCreatedScreen from './WalletCreatedScreen'
import { setStorage, StorageKeys } from '../../storage'
import ImportMasterKeyScreen from './ImportMasterKeyScreen'

jest.mock('../../storage', () => ({
  setStorage: jest.fn(),
  StorageKeys: {
    MNEMONIC: 'mnemonic',
  },
}))

describe('CreateMasterKeyFlow', () => {
  const navigation = {
    navigate: jest.fn(),
  }

  beforeEach(() => {
    navigation.navigate.mockClear()
  })

  it('shows the master key', async () => {
    const { getByTestId } = render(
      <CreateMasterKeyScreen route={{}} navigation={navigation as any} />,
    )

    const newMnemonic = getByTestId('Copy.Mnemonic').children

    expect(newMnemonic.toString().split(' ').length).toBeGreaterThan(12)
  })

  it('confirm the master key', async () => {
    const mnemonic =
      'list slender digital void traffic elevator mandate general throw prepare disagree party disorder tragic popular render beauty present genius dirt wing circle snake dash'

    const { getByTestId } = render(
      <ConfirmMasterKeyScreen
        route={{ params: { mnemonic } }}
        navigation={navigation as any}
      />,
    )

    const confirmInput = getByTestId('Input.Confirm')

    fireEvent.changeText(confirmInput, mnemonic)

    fireEvent.press(getByTestId('Button.Confirm'))

    expect(navigation.navigate).toBeCalledWith('WalletCreated', { mnemonic })
  })

  it('master key created', async () => {
    const mnemonic =
      'list slender digital void traffic elevator mandate general throw prepare disagree party disorder tragic popular render beauty present genius dirt wing circle snake dash'

    const { getByTestId } = render(
      <WalletCreatedScreen
        route={{ params: { mnemonic } }}
        navigation={navigation as any}
      />,
    )

    const subtitle = getByTestId('Text.Subtitle')

    const setStorageMock = jest.fn()
    // @ts-ignore
    setStorage.mockImplementation(setStorageMock)

    waitFor(() => {
      expect(setStorageMock).toBeCalledWith(StorageKeys.MNEMONIC, mnemonic)
    })

    expect(subtitle.children[0]).toBe('Your new wallet is ready!')
  })

  it('import the master key', async () => {
    const mnemonic =
      'list slender digital void traffic elevator mandate general throw prepare disagree party disorder tragic popular render beauty present genius dirt wing circle snake dash'

    const { getByTestId } = render(
      <ImportMasterKeyScreen route={{}} navigation={navigation as any} />,
    )

    const masterKeyInput = getByTestId('Input.MasterKey')

    fireEvent.changeText(masterKeyInput, mnemonic)

    fireEvent.press(getByTestId('Button.Confirm'))

    expect(navigation.navigate).toBeCalledWith('WalletCreated', { mnemonic })
  })
})
