import React, { useContext } from 'react'
import Button from '../../components/button'
import { WalletsContext, TempContext } from '../../Context'
import { Request } from '../../lib/core'

// TEMP - Add a request to the que WITHOUT going through the wallet!
const typedDataRequest = {
  domain: {
    chainId: 31,
    name: 'rLogin sample app',
    verifyingContract: '0x285b30492a3f444d7bf75261a35cb292fc8f41a6',
    version: '1',
  },
  message: {
    contents: 'Welcome to rLogin!',
    num: 1500,
    person: {
      firstName: 'jesse',
      lastName: 'clark',
    },
  },
  // Refers to the keys of the *types* object below.
  primaryType: 'Sample',
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    // Not an EIP712Domain definition
    Sample: [
      { name: 'contents', type: 'string' },
      { name: 'num', type: 'uint256' },
      { name: 'person', type: 'Person' },
    ],
    Person: [
      { name: 'firstName', type: 'string' },
      { name: 'lastName', type: 'string' },
    ],
  },
}

const SignTypedDataScreen = () => {
  const { wallets } = useContext(WalletsContext)
  const { setRequests } = useContext(TempContext)

  const signedTypedData = () => {
    const request = {
      type: 'signTypedData',
      payload: typedDataRequest,
      confirm: () => console.log('CONFIRMED!'),
      reject: () => console.log('REJECTED!'),
    }

    setRequests([request as any as Request])
  }

  return <Button onPress={signedTypedData} title="Sign Typed Data" />
}

export default SignTypedDataScreen
