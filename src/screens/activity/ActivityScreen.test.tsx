/* eslint-disable jest/no-disabled-tests */
import { useNavigation } from '@react-navigation/native'
import { render, act, waitFor, fireEvent } from '@testing-library/react-native'
import { RIFWalletServicesFetcherInterface } from '@rsksmart/rif-wallet-services'

import { setupTest } from 'testLib/setup'
import { getTextFromTextNode, Awaited } from 'testLib/utils'
import {
  createMockFetcher,
  lastTxTextTestId,
  txTestCase,
} from 'testLib/mocks/rifServicesMock'
import {
  createMockAbiEnhancer,
  enhancedTxTestCase,
} from 'testLib/mocks/rifTransactionsMock'
import { ActivityScreen } from 'screens/activity/ActivityScreen'
import { getAddressDisplayText } from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'

const createTestInstance = async (
  fetcher = createMockFetcher(),
  abiEnhancer = createMockAbiEnhancer(),
  { navigation, route }: RootTabsScreenProps<rootTabsRouteNames.Activity>,
) => {
  const mock = await setupTest()

  const container = render(
    <ActivityScreen
      wallet={mock.rifWallet}
      navigation={navigation}
      route={route}
      isWalletDeployed
    />,
  )

  const loadingText = container.getByTestId('Address.Paragraph')
  const { displayAddress } = getAddressDisplayText(
    mock.rifWallet.smartWalletAddress,
  )
  expect(getTextFromTextNode(loadingText)).toContain(displayAddress)
  const waitForEffect = () => container.findByTestId(lastTxTextTestId) // called act without await

  return { container, mock, waitForEffect, fetcher, abiEnhancer }
}

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => {
    return jest.fn()
  },
}))

describe('Activity Screen', function (this: {
  testInstance: Awaited<ReturnType<typeof createTestInstance>>
}) {
  const navigation =
    useNavigation<
      RootTabsScreenProps<rootTabsRouteNames.Activity>['navigation']
    >()

  beforeEach(async () => {
    act(async () => {
      this.testInstance = await createTestInstance(
        undefined,
        undefined,
        navigation,
      )
    })
  })

  describe('initial screen', () => {
    test.skip('load initial UI elements', async () => {
      const {
        container: { getByTestId },
        waitForEffect,
        mock,
      } = this.testInstance

      getTextFromTextNode(getByTestId('Refresh.Button'))
      const { displayAddress } = getAddressDisplayText(
        mock.rifWallet.smartWalletAddress,
      )
      expect(getTextFromTextNode(getByTestId('Address.Paragraph'))).toContain(
        displayAddress,
      )
      await waitForEffect()
    })

    test.skip('transactions amounts', async () => {
      const {
        waitForEffect,
        fetcher,
        container: { getByTestId },
        mock: { rifWallet },
      } = this.testInstance

      await waitForEffect()
      for (const v of txTestCase.data) {
        const enhancedTx = enhancedTxTestCase
        const activityText = getByTestId(`${v.hash}.Text`)
        expect(getTextFromTextNode(activityText)).toEqual(
          `${enhancedTx?.value} ${enhancedTx?.symbol} sent To `,
        )
      }

      expect(fetcher.fetchTransactionsByAddress).toHaveBeenCalledTimes(1)
      expect(fetcher.fetchTransactionsByAddress).toHaveBeenCalledWith(
        rifWallet.smartWalletAddress.toLowerCase(),
        undefined,
        undefined,
      )
    })
  })

  describe('actions', () => {
    test.skip('refresh', async () => {
      const {
        waitForEffect,
        container: { getByTestId },
      } = this.testInstance

      getTextFromTextNode(getByTestId('Refresh.Button'))
      const button = getByTestId('Refresh.Button')
      fireEvent.press(button)

      const loadingText = getByTestId('Info.Text')
      expect(getTextFromTextNode(loadingText)).toContain('Loading transactions')

      await waitForEffect()
    })
  })
})

describe('Activity Screen with Error in Fetcher', function (this: {
  testInstance: Awaited<ReturnType<typeof createTestInstance>>
  fetcher: RIFWalletServicesFetcherInterface
}) {
  beforeEach(async () => {
    this.fetcher = {
      fetchTransactionsByAddress: jest.fn(() => Promise.reject(new Error())),
      fetchTokensByAddress: jest.fn(),
      fetchDapps: jest.fn(),
    }
    act(async () => {
      this.testInstance = await createTestInstance(this.fetcher, null, null)
    })
  })

  describe('initial screen', () => {
    test.skip('handle error', async () => {
      const {
        container: { getByTestId },
      } = this.testInstance

      const loadingText = getByTestId('Info.Text')
      await waitFor(() =>
        expect(getTextFromTextNode(loadingText)).toContain('Error'),
      )
      expect(this.fetcher.fetchTransactionsByAddress).toHaveBeenCalled()
    })
  })
})
