import React from 'react'
import { render, act } from '@testing-library/react-native'
import { shortAddress } from '../../lib/utils'

import { setupTest } from '../../../testLib/setup'
import { getTextFromTextNode, Awaited } from '../../../testLib/utils'

import {
  createMockFetcher,
  lastTxTextTestId,
  txTestCase,
} from '../../../testLib/mocks/rifServicesMock'
import {
  createMockAbiEnhancer,
  enhancedTxTestCase,
} from '../../../testLib/mocks/rifTransactionsMock'
import { ActivityScreen } from './ActivityScreen'

const createTestInstance = async (
  fetcher = createMockFetcher(),
  abiEnhancer = createMockAbiEnhancer(),
) => {
  const mock = await setupTest()

  const container = render(
    <ActivityScreen
      wallet={mock.rifWallet}
      fetcher={fetcher}
      abiEnhancer={abiEnhancer}
    />,
  )

  const loadingText = container.getByTestId('Address.Paragraph')
  expect(getTextFromTextNode(loadingText)).toContain(
    mock.rifWallet.smartWalletAddress,
  )
  const waitForEffect = () => container.findByTestId(lastTxTextTestId) // called act without await

  return { container, mock, waitForEffect, fetcher, abiEnhancer }
}

describe('Activity Screen', function (this: {
  testInstance: Awaited<ReturnType<typeof createTestInstance>>
}) {
  beforeEach(async () => {
    await act(async () => {
      this.testInstance = await createTestInstance()
    })
  })

  describe('initial screen', () => {
    test('load initial UI elements', async () => {
      const {
        container: { getByTestId },
        waitForEffect,
        mock,
      } = this.testInstance

      getTextFromTextNode(getByTestId('Refresh.Button'))
      expect(getTextFromTextNode(getByTestId('Address.Paragraph'))).toContain(
        mock.rifWallet.smartWalletAddress,
      )
      await waitForEffect()
    })

    test('transactions amounts', async () => {
      const {
        waitForEffect,
        fetcher,
        container: { getByTestId },
        mock: { rifWallet },
      } = this.testInstance

      await waitForEffect()
      for (let v of txTestCase) {
        // @ts-ignore
        const enhancedTx = enhancedTxTestCase
        const activityText = getByTestId(`${v.hash}.Text`)
        expect(getTextFromTextNode(activityText)).toEqual(
          `${enhancedTx?.value} ${enhancedTx?.symbol} sent To ${shortAddress(
            enhancedTx?.to,
          )}`,
        )
      }

      expect(fetcher.fetchTransactionsByAddress).toHaveBeenCalledTimes(1)
      expect(fetcher.fetchTransactionsByAddress).toHaveBeenCalledWith(
        rifWallet.address.toLowerCase(),
      )
    })
  })
})
