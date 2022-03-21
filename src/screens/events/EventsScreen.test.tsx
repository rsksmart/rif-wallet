import React from 'react'
import { render } from '@testing-library/react-native'

import { EventsScreen } from './EventsScreen'

const events = [
  {
    blockNumber: 2575642,
    event: 'Transfer',
    timestamp: 1644507399,
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x0000000000000000000000008494a98f2aec3fbb54538446ea7b1205e2940a9f',
      '0x0000000000000000000000000085a940f42d2d9956159d040461b9e343097e09'
    ],
    args: [
      '0x8494a98f2aec3fbb54538446ea7b1205e2940a9f',
      '0x0085a940f42d2d9956159d040461b9e343097e09',
      '0x8ac7230489e80000'
    ],
    transactionHash: '0xc8aa23de8e893d1684d53530be5c659f861d503e4e5635e97925203ef8f3b9a3',
    txStatus: '0x1'
  },
  {
    blockNumber: 2575642,
    event: 'Transfer',
    timestamp: 1644507399,
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x0000000000000000000000000085a940f42d2d9956159d040461b9e343097e09',
      '0x0000000000000000000000008494a98f2aec3fbb54538446ea7b1205e2940a9f'
    ],
    args: [
      '0x0085a940f42d2d9956159d040461b9e343097e09',
      '0x8494a98f2aec3fbb54538446ea7b1205e2940a9f',
      '0x8ac7230489e80000'
    ],
    transactionHash: '0xc8aa23de8e893d1684d53530be5c659f861d503e4e5635e97925203ef8f3b9a4',
    txStatus: '0x1'
  }
]

const smartWalletAddress = '0x0085a940f42d2d9956159d040461b9e343097e09'

describe('Events Screen', () => {
  it('renders Events Screen with 2 events', () => {
    const {getByTestId } = render(<EventsScreen events={events} smartWalletAddress={smartWalletAddress} />)
    expect(getByTestId('events')).toBeDefined()
    expect(getByTestId('0xc8aa23de8e893d1684d53530be5c659f861d503e4e5635e97925203ef8f3b9a3')).toBeDefined()
    expect(getByTestId('0xc8aa23de8e893d1684d53530be5c659f861d503e4e5635e97925203ef8f3b9a4')).toBeDefined()
  })
})