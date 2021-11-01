import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import { ActivityScreen } from './ActivityScreen'
import mockedTransactions from './transactions-mock.json'
import mockedEnhancedTransactions from './enhanced-transactions-mock.json'

//TODO: integration tests pending
jest.mock('../../lib/rifWalletServices/RifWalletServicesFetcher', () => {
  return {
    RifWalletServicesFetcher: jest.fn().mockImplementation(() => {
      return {
        fetchTransactionsByAddress: async () => {
          return mockedTransactions
        },
      }
    }),
  }
})

jest.mock('../../lib/abiEnhancer/AbiEnhancer', () => {
  return {
    AbiEnhancer: jest.fn().mockImplementation(() => {
      return {
        enhance: async () => {
          return mockedEnhancedTransactions[0]
        },
      }
    }),
  }
})

const navigation = {
  navigate: jest.fn(),
}
const route = {
  params: {
    account: {
      smartWalletAddress: '0xbd4c8e11cf2c560382e0dbd6aeef538debf1d449',
      smartWallet: {
        wallet: { address: '0xbd4c8e11cf2c560382e0dbd6aeef538debf1d449' },
        smartWalletContract: {
          interface: {
            decodeFunctionData: function () {
              return {
                data: '0xa9059cbb0000000000000000000000001d4f6a5fe927f0e0e4497b91cebfbcf64da1c9340000000000000000000000000000000000000000000000004563918244f40000',
                to: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
              }
            },
          },
        },
      },
    },
  },
}

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Load activities', () => {
  beforeEach(() => {
    navigation.navigate.mockClear()
  })

  it('Load transactions', async () => {
    const { getByTestId } = render(<ActivityScreen route={route} />)

    await waitFor(() => getByTestId('tx-one-hash.View'))

    expect(getByTestId('tx-two-hash.View')).toBeDefined()
    expect(getByTestId('tx-three-hash.View')).toBeDefined()
    expect(getByTestId('tx-four-hash.View')).toBeDefined()
  })
})
