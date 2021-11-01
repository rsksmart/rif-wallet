import React from 'react'
import { Share } from 'react-native'

import mockClipboard from './clipboard-mock'

import { render, fireEvent, act, GetByAPI, RenderAPI } from '@testing-library/react-native'

import { ReceiveScreen, TestID } from './ReceiveScreen'
import { setupTest } from '../../../testLib/setup'
import { RIFWallet } from '../../lib/core'


describe('Receive Screen', function (this: {
  instance: {
    rifWallet: RIFWallet
    container: RenderAPI
  }
}) {
  beforeEach(async () => {
    // using the same private key to test with snapshots
    const { rifWallet } = await setupTest('0x91de4b5e7256ac842c74f75c2d53804a2ce3df35733e1a716df12337918859e8')
    this.instance = { rifWallet, container: render(<ReceiveScreen wallet={rifWallet} />),  }

  })

  describe('initial screen', () => {
    test('shows smart wallet wallet', async () => {
      expect(this.instance.container.getByTestId(TestID.AddressText).children.join('')).toContain(this.instance.rifWallet.address)
    })

    test('shows qr code', async () => {
      expect(this.instance.container.getByTestId(TestID.QRCode)).toBeDefined()
    })
  })

  describe('actions', () => {
    test('share', () => {
      const spy = spyOn(Share, 'share')
      fireEvent.press(this.instance.container.getByTestId(TestID.Share))

      expect(spy).toHaveBeenCalledWith({
        message: this.instance.rifWallet.address,
        title: this.instance.rifWallet.address
      })
    })
  })
})


// jest.mock('@react-native-community/clipboard', () => mockClipboard)
/*
describe('ReceiveScreen', () => {
  const route = {
    params: {
      account: {
        smartWalletAddress: '0xbd4c8e11cf2c560382e0dbd6aeef538debf1d449',
      },
    },
  }

  it('remove', () => {
    expect(true).toBe(true)
  })

  it('renders', async () => {
    const { getAllByText } = render(<ReceiveScreen route={route} />)

    // make sure elements are showing up
    expect(getAllByText('copy').length).toBe(2)
    expect(getAllByText('share').length).toBe(1)
    expect(getAllByText(/0xbd4c\.\.\.d449/).length).toBe(1)
  })

  it('can copy address', () => {
    jest.useFakeTimers()

    const { getByTestId } = render(<ReceiveScreen route={route} />)

    act(() => {
      fireEvent.press(getByTestId('Copy.Account.Button'))

      expect(mockClipboard.setString).toBeCalledTimes(1)
    })
  })
})
*/