import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TokenImage } from './TokenImage'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

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

  if (!rbtcToken || !rifToken) {
    const missingToken = !rbtcToken ? 'TRBTC' : 'tRIF'

    const handleClick = () =>
      navigation.navigate('InjectedBrowserUX', {
        screen: 'InjectedBrowser',
        params: {
          uri:
            missingToken === 'TRBTC'
              ? 'https://faucet.rsk.co/'
              : 'https://faucet.rifos.org/',
        },
      })

    return (
      <TouchableOpacity style={styles.background} onPress={handleClick}>
        <View style={styles.iconContainer}>
          <TokenImage symbol={missingToken} width={45} height={45} />
        </View>
        <View style={styles.textContainer}>
          <Text testID="Faucet.Text">
            {`Your wallet doesn't have any ${missingToken}. Click here to get some from the faucet!`}
          </Text>
        </View>
      </TouchableOpacity>
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
