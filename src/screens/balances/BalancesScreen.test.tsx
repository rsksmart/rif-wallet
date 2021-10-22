import React from 'react'

import { render, fireEvent, waitFor, act } from '@testing-library/react-native'

import BalancesScreen from './BalancesScreen'

import mockedTokens from './tokens-mock.json'
//TODO: integration tests pending
jest.mock('../../lib/rifWalletServices/RifWalletServicesFetcher', () => {
  return {
    RifWalletServicesFetcher: jest.fn().mockImplementation(() => {
      return {
        fetchTokensByAddress: () => {
          return mockedTokens
        },
      }
    }),
  }
})
describe('Load balances', () => {
  const navigation = {
    navigate: jest.fn(),
  }
  beforeEach(() => {
    navigation.navigate.mockClear()
  })
  const route = {
    params: {
      account: {
        smartWalletAddress: '0xbd4c8e11cf2c560382e0dbd6aeef538debf1d449',
      },
    },
  }

  it('selects token in balance to send', async () => {
    const { rerender, getByTestId } = render(
      <BalancesScreen route={route} navigation={navigation as any} />,
    )

    act(() => {
      rerender(<BalancesScreen route={route} navigation={navigation as any} />)
    })

    await waitFor(() => expect(getByTestId('cUSDT.View')).toBeDefined())
    await waitFor(() => expect(getByTestId('rUSDT.View')).toBeDefined())
    await waitFor(() => expect(getByTestId('DOC.View')).toBeDefined())
    await waitFor(() => expect(getByTestId('cRBTC.View')).toBeDefined())
    await waitFor(() => expect(getByTestId('cRIF.View')).toBeDefined())
    await waitFor(() => expect(getByTestId('tRIF.View')).toBeDefined())
  })

  it('select token to send', async () => {
    const { rerender, getByTestId } = render(
      <BalancesScreen route={route} navigation={navigation as any} />,
    )

    act(() => {
      rerender(<BalancesScreen route={route} navigation={navigation as any} />)
    })

    await waitFor(() => expect(getByTestId('tRIF.Button')).toBeDefined())

    fireEvent.press(getByTestId('tRIF.Button'))

    expect(navigation.navigate).toBeCalled()
  })
})
