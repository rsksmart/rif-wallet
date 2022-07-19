import React from 'react'
import { Share } from 'react-native'

import { fireEvent, render, RenderAPI } from '@testing-library/react-native'

import { getAddressDisplayText } from '../../components'
import { ReceiveScreen, TestID } from './ReceiveScreen'

describe('Receive Screen', function () {
  let container: RenderAPI
  const smartWalletAddress = '0x0085a940f42d2d9956159d040461b9e343097e09'

  beforeEach(async () => {
    container = render(
      <ReceiveScreen
        smartWalletAddress={smartWalletAddress}
        registeredDomains={['helloworld.rsk']}
      />,
    )
  })

  test('renders qr', () => {
    const QRNode = container.getByTestId(TestID.QRCodeDisplay)

    expect(QRNode).toBeDefined()
  })

  test('renders smart wallet address', () => {
    const smartWalletAddressNode = container.getByTestId(TestID.AddressText)
    const { displayAddress } = getAddressDisplayText(smartWalletAddress)

    expect(smartWalletAddressNode).toBeDefined()
    expect(container.getByText(displayAddress)).toBeDefined()
    expect(smartWalletAddressNode.children.join('')).toContain(displayAddress)
  })

  test('renders copy button', async () => {
    const copyNode = container.getByTestId(TestID.CopyButton)

    expect(copyNode).toBeDefined()
  })

  test('renders and presses share button', () => {
    const { checksumAddress } = getAddressDisplayText(smartWalletAddress)
    const shareNode = container.getByTestId(TestID.ShareButton)
    const spy = jest.spyOn(Share, 'share')
    fireEvent.press(shareNode)

    expect(shareNode).toBeDefined()
    expect(spy).toBeCalled()
    expect(spy).toHaveBeenCalledWith({
      message: checksumAddress,
      title: checksumAddress,
    })
  })
})
