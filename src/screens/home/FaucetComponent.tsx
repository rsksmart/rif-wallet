import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TokenImage } from './TokenImage'

interface Interface {
  navigation: any
  rbtcBalance: boolean
  rifBalance: boolean
}

const FaucetComponent: React.FC<Interface> = ({
  rbtcBalance,
  rifBalance,
  navigation,
}) => {
  if (!rbtcBalance || !rifBalance) {
    const missingToken = !rbtcBalance ? 'TRBTC' : 'tRIF'

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
