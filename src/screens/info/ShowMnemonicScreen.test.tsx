import { Provider } from 'react-redux'
import { render } from '@testing-library/react-native'

import { ShowMnemonicScreen, TestID } from './ShowMnemonicScreen'
import { setupTest } from '../../../testLib/setup'
import { Awaited, getTextFromTextNode } from '../../../testLib/utils'
import { store } from 'store/index'

const createTestInstance = async () => {
  const { rifWallet } = await setupTest()
  const testMnemonic = 'MNEMONIC'

  const container = render(
    <Provider store={store}>
      <ShowMnemonicScreen />
    </Provider>,
  )

  return { container, rifWallet, testMnemonic }
}

describe('Keys Info Screen', function (this: {
  testInstance: Awaited<ReturnType<typeof createTestInstance>>
}) {
  beforeEach(async () => {
    this.testInstance = await createTestInstance()
  })
  describe('initial screen', () => {
    test('shows mnemonic', async () => {
      const {
        container: { getByTestId },
        testMnemonic,
      } = this.testInstance

      expect(getTextFromTextNode(getByTestId(TestID.Mnemonic))).toEqual(
        testMnemonic,
      )
    })
  })
})
