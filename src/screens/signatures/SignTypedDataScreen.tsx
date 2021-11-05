import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Button, CopyComponent } from '../../components'
import { ScreenWithWallet } from '../types'

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: 1,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
}

// The named list of all type definitions
const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
}

// The data to sign
const value = {
  from: {
    name: 'Cow',
    wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
  },
  to: {
    name: 'Bob',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  },
  contents: 'Hello, Bob!',
}

export const SignTypedDataScreen: React.FC<ScreenWithWallet> = ({ wallet }) => {
  const [hash, setHash] = useState<null | string>(null)
  const [message, setMessage] = useState<null | string>(null)

  const signedTypedData = () => {
    setHash(null)
    setMessage(null)

    wallet
      ._signTypedData(domain, types, value)
      .then((result: string) => setHash(result))
      .catch((err: Error) => setMessage(err.toString()))
  }

  return (
    <View>
      <Button onPress={signedTypedData} title="Sign Typed Data" />
      {hash && <CopyComponent value={hash} />}
      {message && <Text>{message}</Text>}
    </View>
  )
}
