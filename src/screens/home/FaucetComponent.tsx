import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { TokenImage } from './TokenImage'

interface Interface {
  navigation: any
  balances: ITokenWithBalance[]
}

const FaucetComponent: React.FC<Interface> = ({ navigation, balances }) => {
  const [rifToken, setRifToken] = useState<ITokenWithBalance | undefined>(
    undefined,
  )
  const [rbtcToken, setRbtcToken] = useState<ITokenWithBalance | undefined>(
    undefined,
  )

  useEffect(() => {
    setRifToken(balances.find(token => token.symbol === 'tRIF'))
    setRbtcToken(balances.find(token => token.symbol === 'TRBTC'))
  }, [balances])

  const missingRbtc = !rbtcToken || BigNumber.from(rbtcToken.balance).isZero()
  const missingRif = !rifToken || BigNumber.from(rifToken.balance).isZero()
  if (missingRbtc || missingRif) {
    const missingToken = missingRbtc ? 'TRBTC' : 'tRIF'

    return (
      <View style={styles.background}>
        <View style={styles.iconContainer}>
          <TokenImage symbol={missingToken} width={45} height={45} />
        </View>
        <View style={styles.textContainer}>
          <Text testID="Faucet.Text">
            {`Your wallet doesn't have any ${missingToken}.`}
          </Text>
        </View>
      </View>
    )
  }

  return <></>
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(255, 255, 255, .55)',
    borderColor: 'rgba(0, 0, 0, .1)',
    borderWidth: 1,
    padding: 20,
    marginHorizontal: 25,
    marginTop: 25,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  iconContainer: {
    display: 'flex',
    flex: 2,
  },
  textContainer: {
    display: 'flex',
    flex: 8,
  },
})

export default FaucetComponent
