import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { NavigationProp } from '../../RootNavigation'
import SelectedTokenComponent from './SelectedTokenComponent'
import { getTokenColor } from './tokenColor'
import PortfolioComponent from './PortfolioComponent'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { colors } from '../../styles/colors'
import SendReceiveButtonComponent from './SendReceiveButtonComponent'

export const HomeScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { state } = useSocketsState()

  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined,
  )

  // token or undefined
  const selected = selectedAddress ? state.balances[selectedAddress] : undefined
  const selectedPrice =
    selectedAddress && state.prices[selectedAddress]
      ? state.prices[selectedAddress].price
      : undefined
  const selectedColor = getTokenColor(selected ? selected.symbol : undefined)

  useEffect(() => {
    if (!selected) {
      Object.values(state.balances).length !== 0
        ? setSelectedAddress(Object.values(state.balances)[0].contractAddress)
        : undefined
    }
  }, [state.balances])

  // interact with the navigation
  const handleSendReceive = (screen: 'SEND' | 'RECEIVE' | 'FAUCET') => {
    switch (screen) {
      case 'SEND':
        return navigation.navigate('Send', {
          token: selected?.symbol,
          contractAddress: selected?.contractAddress,
        })
      case 'RECEIVE':
        return navigation.navigate('Receive')
      case 'FAUCET':
        console.log('@todo: faucet component is not implemented yet.')
        return
    }
  }

  return (
    <View style={styles.parent}>
      {/*
      <FaucetComponent
        navigation={navigation}
        balances={Object.values(state.balances)}
      />
      */}
      {selected && (
        <SelectedTokenComponent token={selected} conversion={selectedPrice} />
      )}

      <SendReceiveButtonComponent
        color={selectedColor}
        onPress={handleSendReceive}
      />

      <PortfolioComponent
        selectedAddress={selectedAddress}
        setSelected={setSelectedAddress}
        balances={Object.values(state.balances)}
        prices={state.prices}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.darkPurple3,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 10,
  },
})
