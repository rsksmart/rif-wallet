import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TokenImage } from './TokenImage'

interface Interface {
  navigation: any
  isWalletDeployed: boolean
}

const SmartWalletDeployComponent: React.FC<Interface> = ({
  navigation,
  isWalletDeployed,
}) => {
  if (isWalletDeployed) {
    const handleClick = () => navigation.navigate('WalletInfo')

    return (
      <TouchableOpacity style={styles.background} onPress={handleClick}>
        <View style={styles.iconContainer}>
          <TokenImage symbol={'TRBTC'} width={45} height={45} />
        </View>
        <View style={styles.textContainer}>
          <Text testID="Faucet.Text">
            {
              'Your smart wallet is not deployed. Click here for more information.'
            }
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

export default SmartWalletDeployComponent
