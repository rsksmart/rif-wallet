import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import FaucetComponent from './FaucetComponent'

describe('FaucetComponent', () => {
  const navigation = {
    navigate: jest.fn(),
  }

  it('shows rbtc', () => {
    const { getByTestId } = render(
      <FaucetComponent
        rbtcBalance={0}
        rifBalance={0}
        navigation={navigation}
      />,
    )

    expect(getByTestId('Faucet.Text').children[0]).toBe(
      "Your wallet doesn't have any TRBTC. Click here to get some from the faucet!",
    )

    fireEvent.press(getByTestId('Faucet.Text'))

    expect(navigation.navigate).toBeCalledWith('InjectedBrowserUX', {
      params: { uri: 'https://faucet.rsk.co/' },
      screen: 'InjectedBrowser',
    })
  })

  it('shows tRIF', () => {
    const { getByTestId } = render(
      <FaucetComponent
        rbtcBalance={1}
        rifBalance={0}
        navigation={navigation}
      />,
    )

    expect(getByTestId('Faucet.Text').children[0]).toBe(
      "Your wallet doesn't have any tRIF. Click here to get some from the faucet!",
    )

    fireEvent.press(getByTestId('Faucet.Text'))

    expect(navigation.navigate).toBeCalledWith('InjectedBrowserUX', {
      params: { uri: 'https://faucet.rifos.org/' },
      screen: 'InjectedBrowser',
    })
  })

  it('shows nothing', () => {
    const { queryAllByTestId } = render(
      <FaucetComponent
        rbtcBalance={1}
        rifBalance={1}
        navigation={navigation}
      />,
    )

    expect(queryAllByTestId('Faucet.Text')).toMatchObject([])
  })
})
