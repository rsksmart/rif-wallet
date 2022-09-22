import { render } from '@testing-library/react-native'
import React from 'react'
import FaucetComponent from './FaucetComponent'

const rifTokenMock = {
  name: 'tRIF Token',
  symbol: 'tRIF',
  contractAddress: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
  decimals: 18,
  balance: '0x3479b2d750f220000',
  logo: '',
}

const rbtcMock = {
  name: 'TRBTC',
  logo: '',
  symbol: 'TRBTC',
  contractAddress: '0x0000000000000000000000000000000000000000',
  decimals: 18,
  balance: '9669199754592360',
}

describe('FaucetComponent', () => {
  const navigation = {
    navigate: jest.fn(),
  }

  it('shows rbtc', () => {
    const { getByTestId } = render(
      <FaucetComponent balances={[]} navigation={navigation} />,
    )

    expect(getByTestId('Faucet.Text').children[0]).toBe(
      "Your wallet doesn't have any TRBTC.",
    )
  })

  it('shows tRIF', () => {
    const { getByTestId } = render(
      <FaucetComponent balances={[rbtcMock]} navigation={navigation} />,
    )

    expect(getByTestId('Faucet.Text').children[0]).toBe(
      "Your wallet doesn't have any tRIF.",
    )
  })

  it('shows nothing', () => {
    const { queryAllByTestId } = render(
      <FaucetComponent
        balances={[rifTokenMock, rbtcMock]}
        navigation={navigation}
      />,
    )

    expect(queryAllByTestId('Faucet.Text')).toMatchObject([])
  })
})
