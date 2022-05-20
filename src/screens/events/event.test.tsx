import React from 'react'
import { render } from '@testing-library/react-native'
import { Event } from './event'
import { getAddressDisplayText } from '../../components'

describe('Event component', () => {
  it('renders props corrently', () => {
    const displayedFrom = getAddressDisplayText(
      '0x8494a98f2aec3fbb54538446ea7b1205e2940a9f',
    ).displayAddress
    const displayedTo = getAddressDisplayText(
      '0x0085a940f42d2d9956159d040461b9e343097e09',
    ).displayAddress
    const displayedTx = getAddressDisplayText(
      '0xc8aa23de8e893d1684d53530be5c659f861d503e4e5635e97925203ef8f3b9a3',
    ).displayAddress
    const { getByTestId } = render(
      <Event
        from="0x8494a98f2aec3fbb54538446ea7b1205e2940a9f"
        to="0x0085a940f42d2d9956159d040461b9e343097e09"
        tx="0xc8aa23de8e893d1684d53530be5c659f861d503e4e5635e97925203ef8f3b9a3"
      />,
    )

    expect(getByTestId('tx').children.join('')).toContain(displayedTx)
    expect(getByTestId('from').children.join('')).toContain(displayedFrom)
    expect(getByTestId('to').children.join('')).toContain(displayedTo)
  })
})
