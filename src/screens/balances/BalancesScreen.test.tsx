/* eslint-disable */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { BalancesScreen, balanceToString } from './BalancesScreen'

import { setupTest } from '../../../testLib/setup'
import {
  sendAndWait,
  getTextFromTextNode,
  Awaited,
} from '../../../testLib/utils'
import {
  createMockFetcher,
  testCase,
  lastToken,
  lastTokenTextTestId,
} from '../../../testLib/mocks/rifServicesMock'
import { RIFSocketsProvider } from '../../subscriptions/RIFSockets'
import { IRifWalletServicesSocket } from '../../lib/rifWalletServices/RifWalletServicesSocket'
import EventEmitter from 'events'

import tempRecent from '../../../testLib/mocks/testBalances.json'
import { constants } from 'ethers'
import { createMockAbiEnhancer } from '../../../testLib/mocks/rifTransactionsMock'

class RifWalletServicesSocketMock
  extends EventEmitter
  implements IRifWalletServicesSocket
{
  async connect() {
    this.emit('init', {
      transactions: tempRecent,
      balances: testCase,
    })
  }
  disconnect() {
    // nothing
  }
}

const abiEnhancer = createMockAbiEnhancer()

const createTestInstance = async (fetcher = createMockFetcher()) => {
  const mock = await setupTest()

  const socketMock = new RifWalletServicesSocketMock()

  const container = render(
    <RIFSocketsProvider
      rifServiceSocket={socketMock}
      isWalletDeployed={true}
      abiEnhancer={abiEnhancer}>
      <BalancesScreen
        wallet={mock.rifWallet}
        isWalletDeployed={true}
        navigation={mock.navigation}
        route={{} as any}
        fetcher={fetcher}
      />
    </RIFSocketsProvider>,
  )

  const loadingText = container.getByTestId('Info.Text')
  expect(getTextFromTextNode(loadingText)).toContain('Loading')

  const waitForEffect = () => container.findByTestId(lastTokenTextTestId) // called act without await
  // waits for things to be rendered in the happy path

  const testRBTCBalance = async () => {
    const actual = getTextFromTextNode(
      container.getByTestId(`${constants.AddressZero}.Text`),
    )
    const expected = await mock.rifWallet.smartWallet.signer
      .getBalance()
      .then(balance => `${balanceToString(balance.toString(), 18)} TRBTC`)

    expect(actual).toContain(expected)
  }

  return { container, mock, waitForEffect, testRBTCBalance, fetcher }
}

describe('Balances Screen', function (this: {
  testInstance: Awaited<ReturnType<typeof createTestInstance>>
}) {
  beforeEach(async () => {
    this.testInstance = await createTestInstance()
  })

  describe('initial screen', () => {
    test.skip('starts loading', async () => {
      const {
        container: { getByTestId },
      } = this.testInstance

      const testLoading = getTextFromTextNode(getByTestId('Info.Text'))

      expect(testLoading).toContain('Loading balances. Please wait...')
    })

    test.skip('account balance', async () => {
      const { waitForEffect, testRBTCBalance } = this.testInstance
      await waitForEffect()

      await testRBTCBalance()
    })

    test.skip('token balances', async () => {
      const {
        waitForEffect,
        container: { findByTestId, getByTestId },
      } = this.testInstance
      await waitForEffect()

      await findByTestId(lastTokenTextTestId)

      for (let v of testCase) {
        const balanceText = getByTestId(`${v.contractAddress}.Text`)
        expect(getTextFromTextNode(balanceText)).toEqual(
          `${balanceToString(v.balance, v.decimals)} ${v.symbol}`,
        )
      }
    })

    // we don't have any error handling yet
    test.skip('handle error', async () => {
      const fetcher = {
        fetchTokensByAddress: jest.fn(() => Promise.reject(new Error())),
      }

      const {
        container: { getByTestId },
      } = await createTestInstance(fetcher as any)

      const loadingText = getByTestId('Info.Text')
      expect(getTextFromTextNode(loadingText)).toContain('Loading')

      await waitFor(() =>
        expect(getTextFromTextNode(loadingText)).toContain('Error'),
      )

      expect(fetcher.fetchTokensByAddress).toHaveBeenCalled()
    })
  })

  describe('actions', () => {
    test.skip('refresh', async () => {
      const {
        waitForEffect,
        testRBTCBalance,
        container: { getByTestId },
        mock: { rifWallet },
      } = this.testInstance
      await waitForEffect()

      await sendAndWait(
        rifWallet.sendTransaction({
          to: '0x0000000000111111111122222222223333333333',
          value: '0x200',
          data: '0xabcd',
        }),
      )

      const button = getByTestId('Refresh.Button')
      fireEvent.press(button)

      const loadingText = getByTestId('Info.Text')
      expect(getTextFromTextNode(loadingText)).toContain(
        'Loading balances. Please wait...',
      )

      await waitForEffect()

      await testRBTCBalance()
    })

    test.skip('navigation', async () => {
      const {
        waitForEffect,
        container: { getByTestId },
        mock: { navigation },
      } = this.testInstance
      await waitForEffect()

      const button = getByTestId(`${lastToken.contractAddress}.SendButton`)
      fireEvent.press(button)

      // TODO: send whole token info and block the ui for choosing another token
      expect(navigation.navigate).toHaveBeenCalledWith('Send', {
        token: lastToken.symbol,
      })
    })
  })
})
