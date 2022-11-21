import { StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'

import { SemiBoldText, MediumText } from 'src/components'
import { useSelectedWallet } from 'src/Context'
import { AddressCopyComponent } from 'src/components/copy/AddressCopyComponent'

// interface Props {}

export const GatewayScreen = () => {
  // RIFWallet (the smartwallet):
  const { wallet, chainId } = useSelectedWallet()

  // the RPC Provider:
  const provider = wallet.provider

  // the signer (i.e. the EOA account)
  const signer = wallet.smartWallet.signer

  const [rbtcBalance, setRbtcBalance] = useState<BigNumber>(BigNumber.from(0))
  const [eoaAddress, setEoaAddress] = useState<string>('')
  const [block, setBlock] = useState<number>(0)

  // the following should all outside of this component, but it is for demostration right now
  useEffect(() => {
    signer.getAddress().then(setEoaAddress)
  }, [wallet])

  useEffect(() => {
    signer.getBalance().then(setRbtcBalance)
  }, [wallet])

  useEffect(() => {
    provider?.getBlockNumber().then(setBlock)
  })

  return (
    <View style={styles.parent}>
      <SemiBoldText style={styles.heading}>Gateway Screen</SemiBoldText>
      <MediumText>Chain Id: {chainId}</MediumText>
      <MediumText>Block: {block}</MediumText>
      <MediumText>Address:</MediumText>
      <AddressCopyComponent address={eoaAddress} />
      <MediumText>rBTC Balance: {rbtcBalance.toString()}</MediumText>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    padding: 20,
  },
  heading: {
    fontSize: 26,
  },
})
