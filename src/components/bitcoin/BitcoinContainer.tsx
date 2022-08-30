import { useBitcoinCoreContext } from '../../Context'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { MediumText, SemiBoldText } from '../typography'
import { colors } from '../../styles'

const BitcoinContainer = () => {
  const btc = useBitcoinCoreContext()

  const first20addresses: Array<string> = useMemo(() => {
    let counter = 0
    let addresses = []
    while (counter < 20) {
      addresses.push(btc?.getAccountAddress(counter))
      counter++
    }
    return addresses
  }, [btc])

  if (!btc) {
    return (
      <View style={styles.container}>
        <MediumText>Bitcoin is not defined.</MediumText>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View>
        <SemiBoldText>BTC Account Public Key BIP 84</SemiBoldText>
        <MediumText>{btc.getPublicKey()}</MediumText>
      </View>
      <View>
        <SemiBoldText>Addresses:</SemiBoldText>
        {first20addresses.map(address => (
          <MediumText key={address} style={styles.addressText}>
            {address}
          </MediumText>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.light,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: '5%',
  },
  addressText: {
    fontSize: 12,
  },
})
export default React.memo(BitcoinContainer)
