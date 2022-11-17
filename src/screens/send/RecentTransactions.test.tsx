import { render } from '@testing-library/react-native'
import { activityTxTestCase } from '../../../testLib/mocks/rifTransactionsMock'
import { RecentTransactions } from './RecentTransactions'

describe('RecentTransactions', () => {
  it('should show a message for empty transactions', async () => {
    const component = render(
      <RecentTransactions transactions={[]} onSelect={jest.fn} />,
    )
    const view = await component.findByTestId('Empty.RegularText')
    expect(view).toBeTruthy()
  })

  it('should render not duplicated addresses only', async () => {
    const component = render(
      <RecentTransactions
        transactions={activityTxTestCase}
        onSelect={jest.fn}
      />,
    )

    const view = await component.findByTestId('Data.View')
    expect(view.children.length).toBe(2)
  })
})
