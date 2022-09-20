import React from 'react'
import BitcoinReceiveContainer from '../../components/bitcoin/BitcoinReceiveContainer'

const BitcoinReceiveScreen: React.FC<any> = ({
  route: {
    params: { network },
  },
}) => <BitcoinReceiveContainer defaultNetwork={network} />

export default BitcoinReceiveScreen
