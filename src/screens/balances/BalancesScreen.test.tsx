import React from 'react'
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { BalancesScreen, balanceToString } from "./BalancesScreen"

import { setupTest } from '../../../testLib/setup'
import { sendAndWait, getTextFromTextNode } from '../../../testLib/utils'
import { createMockFetcher, testCase, lastToken, lastTokenTextTestId } from '../../../testLib/mocks/rifServicesMock'

const createTestInstace = async (
  fetcher = createMockFetcher()
) => {
  const mock = await setupTest()

  const container = render(<BalancesScreen
    wallet={mock.rifWallet}
    navigation={mock.navigation}
    route={{} as any}
    fetcher={fetcher}
  />)

  const loadingText = container.getByTestId('Info.Text')
  expect(getTextFromTextNode(loadingText)).toContain('Loading')

  const waitForEffect = () => container.findByTestId(lastTokenTextTestId) // called act without await
  // waits for things to be rendered in the happy path

  const testRBTCBalance = async() => {
    const actual = getTextFromTextNode(container.getByTestId('RBTC.Text'))
    const expected = await mock.rifWallet.smartWallet.signer.getBalance()
      .then(balance => `${balanceToString(balance.toString(), 18)} TRBTC`)

    expect(actual).toContain(expected)
  }

  return { container, mock, waitForEffect, testRBTCBalance, fetcher }

}

// https://stackoverflow.com/questions/48011353/how-to-unwrap-type-of-a-promise
type Awaited<T> = T extends PromiseLike<infer U> ? U : T

describe('Balances screen', function(this: {
  testInstance: Awaited<ReturnType<typeof createTestInstace>>
}) {
  beforeEach(async () => {
    this.testInstance = await createTestInstace()
  })

  describe('initial screen', () => {
    test('starts loading', async () => {
      const { container: { getByTestId }, waitForEffect } = this.testInstance

      expect(getTextFromTextNode(getByTestId('Info.Text'))).toContain('Loading')
      await waitForEffect()
    })

    test('account balance', async () => {
      const { waitForEffect, testRBTCBalance } = this.testInstance
      await waitForEffect()

      await testRBTCBalance()
    })

    test('token balances', async () => {
      const { waitForEffect, fetcher, container: { findByTestId, getByTestId }, mock: { rifWallet } } = this.testInstance
      await waitForEffect()

      await findByTestId(lastTokenTextTestId)

      for (let v of testCase) {
        const balanceText = getByTestId(`${v.contractAddress}.Text`)
        expect(getTextFromTextNode(balanceText)).toEqual(`${balanceToString(v.balance, v.decimals)} ${v.symbol}`)
      }

      expect(fetcher.fetchTokensByAddress).toHaveBeenCalledTimes(1)
      expect(fetcher.fetchTokensByAddress).toHaveBeenCalledWith(rifWallet.address)
    })

    test('handle error', async () => {
      const fetcher = {
        fetchTokensByAddress: jest.fn(() => Promise.reject(new Error()) )
      }

      const { container: { getByTestId } } = await createTestInstace(fetcher)

      const loadingText = getByTestId('Info.Text')
      expect(getTextFromTextNode(loadingText)).toContain('Loading')

      await waitFor(() => expect(getTextFromTextNode(loadingText)).toContain('Error'))

      expect(fetcher.fetchTokensByAddress).toHaveBeenCalled()
    })
  })

  describe('actions', () => {
    test('refresh', async () => {
      const { waitForEffect, fetcher, testRBTCBalance, container: { getByTestId }, mock: { rifWallet } } = this.testInstance
      await waitForEffect()

      await sendAndWait(rifWallet.signer.sendTransaction({ to: '0x0000000000111111111122222222223333333333', value: '0x200', data: '0xabcd' }))

      const button = getByTestId('Refresh.Button')
      fireEvent.press(button)

      const loadingText = getByTestId('Info.Text')
      expect(getTextFromTextNode(loadingText)).toContain('Loading')

      await waitForEffect()

      await testRBTCBalance()
      expect(fetcher.fetchTokensByAddress).toHaveBeenCalledTimes(2)
      expect(fetcher.fetchTokensByAddress).toHaveBeenCalledWith(rifWallet.address)
    })

    test('navigation', async () => {
      const { waitForEffect, container: { getByTestId }, mock: { navigation } } = this.testInstance
      await waitForEffect()

      const button = getByTestId(`${lastToken.contractAddress}.SendButton`)
      fireEvent.press(button)

      // TODO: send whole token info and block the ui for choosing another token
      expect(navigation.navigate).toHaveBeenCalledWith("Send", { "token": lastToken.symbol })
    })
  })
})
