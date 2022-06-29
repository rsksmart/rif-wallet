import React from 'react'

import { render, fireEvent, act, waitFor } from '@testing-library/react-native'

import { SendScreen } from './SendScreen'
import * as tokenMetadata from 'rif-wallet/packages/token'
import { deployTestTokens, getSigner } from '../../../testLib/utils'

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Load Tokens', () => {
  const route = {
    params: {
      account: {
        smartWalletAddress: '0xbd4c8e11cf2c560382e0dbd6aeef538debf1d449',
      },
    },
  }

  beforeEach(async () => {
    const accountSigner = getSigner()
    const { firstErc20Token, secondErc20Token, rbtcToken } =
      await deployTestTokens(accountSigner)

    ;(tokenMetadata.getAllTokens as any) = jest.fn(() =>
      Promise.resolve([firstErc20Token, secondErc20Token]),
    )
    ;(tokenMetadata.makeRBTCToken as any) = jest.fn(() => rbtcToken)
  })
  it('renders', async () => {
    const { getByPlaceholderText, rerender } = render(
      <SendScreen route={route} />,
    )

    act(() => {
      rerender(<SendScreen route={route} />)
    })

    getByPlaceholderText('Amount')
    getByPlaceholderText('To')
  })

  test('selects tokens', async () => {
    const { rerender, getByTestId } = render(<SendScreen route={route} />)

    act(async () => {
      await rerender(<SendScreen route={route} />)
    })

    const picker = getByTestId('Tokens.Picker')

    act(async () => {
      await fireEvent(picker, 'onValueChange', 'FIRST_TEST_ERC20')
      expect(picker.props.selectedIndex).toStrictEqual(0)

      await fireEvent(picker, 'onValueChange', 'SECOND_TEST_ERC20')
      expect(picker.props.selectedIndex).toBe(1)
    })
  })

  test('send transaction', async () => {
    const { rerender, getByTestId } = render(<SendScreen route={route} />)

    act(() => {
      rerender(<SendScreen route={route} />)
    })

    const picker = getByTestId('Tokens.Picker')
    fireEvent(picker, 'onValueChange', 'FIRST_TEST_ERC20')

    const receivingAccount = getSigner(1)

    fireEvent.changeText(
      getByTestId('To.Input'),
      await receivingAccount.getAddress(),
    )
    const sendingAmount = '10'
    fireEvent.changeText(getByTestId('Amount.Input'), sendingAmount)
    fireEvent.press(getByTestId('Next.Button'))
    await waitFor(() => expect(getByTestId('TxReceipt.View')).toBeDefined())
  })
})
