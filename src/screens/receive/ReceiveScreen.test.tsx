import React from 'react'
import { Share } from 'react-native'

import { render, fireEvent, RenderAPI } from '@testing-library/react-native'

import { ReceiveScreen, TestID } from './ReceiveScreen'
import { setupTest } from '../../../testLib/setup'
import { RIFWallet } from 'rif-wallet/packages/core'
import { getAddressDisplayText } from '../../components'

describe('Receive Screen', function (this: {
  instance: {
    rifWallet: RIFWallet
    container: RenderAPI
  }
}) {
  beforeEach(async () => {
    // using the same private key to test with snapshots
    const { rifWallet } = await setupTest(
      '0x91de4b5e7256ac842c74f75c2d53804a2ce3df35733e1a716df12337918859e8',
    )
    this.instance = {
      rifWallet,
      container: render(
        <ReceiveScreen
          wallet={rifWallet}
          isWalletDeployed={true}
          route={{
            params: {
              token: 'RIF',
            },
          }}
        />,
      ),
    }
  })

  describe('initial screen', () => {
    test('shows smart wallet wallet', async () => {
      const { displayAddress } = getAddressDisplayText(
        this.instance.rifWallet.smartWalletAddress,
      )
      expect(
        this.instance.container
          .getByTestId(TestID.AddressText)
          .children.join(''),
      ).toContain(displayAddress)
    })

    test('shows qr code', async () => {
      expect(
        this.instance.container.getByTestId(TestID.QRCodeDisplay),
      ).toBeDefined()
    })
  })

  describe('actions', () => {
    test('share', () => {
      const spy = jest.spyOn(Share, 'share')
      fireEvent.press(this.instance.container.getByTestId(TestID.ShareButton))

      expect(spy).toHaveBeenCalledWith({
        message: this.instance.rifWallet.smartWalletAddress,
        title: this.instance.rifWallet.smartWalletAddress,
      })
    })
  })
})
