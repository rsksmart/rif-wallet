import React, { useState, useEffect } from 'react'
import { ReceiveScreen } from './ReceiveScreen'

const BitcoinReceiveScreen: React.FC<any> = ({
  route: {
    params: { network },
  },
}) => {
  const [address, setAddress] = useState<string>('')
  // In the future we must be able to select address type
  useEffect(() => {
    network.bips[0]
      .fetchExternalAvailableAddress()
      .then((addressBackend: string) => setAddress(addressBackend))
  }, [])
  return (
    <ReceiveScreen
      registeredDomains={[]}
      address={address === '' ? 'Loading...' : address}
      displayAddress={address === '' ? 'Loading...' : address}
    />
  )
}

export default BitcoinReceiveScreen
