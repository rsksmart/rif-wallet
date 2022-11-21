import { BigNumber } from 'ethers'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { MediumText } from 'src/components'

interface Props {}

export const GatewayScreen = () => {
  const [rifTokenBalance, setRifTokenBalance] = useState<BigNumber>(
    BigNumber.from(0),
  )

  return (
    <View>
      <MediumText>Gateway Screen</MediumText>
      <MediumText>RIF Balance: {rifTokenBalance.toString()}</MediumText>
    </View>
  )
}

const styles = StyleSheet.create({})
