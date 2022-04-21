import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { NavigationProp } from '../../RootNavigation'
import SelectedTokenComponent from './SelectedTokenComponent'
import { getTokenColor } from './tokenColor'
import PortfolioComponent from './PortfolioComponent'
import ActivityComponent from './ActivityComponent'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import FaucetComponent from './FaucetComponent'
import { ScrollView } from 'react-native-gesture-handler'
import { colors } from '../../styles/colors'
import SendReceiveButtonComponent from './SendReceiveButtonComponent'

export const HomeScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { state } = useSocketsState()

  console.log(state)

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

  const handleSendReceive = (screen: 'SEND' | 'RECEIVE' | 'FAUCET') => {
    console.log('heheheheheheh!', screen)
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

  // @JESSE, below this line may not be needed
  const [selectedPanel, setSelectedPanel] = useState<string>('portfolio')

  return (
    <View style={styles.parent}>
      <ScrollView style={styles.container}>
        <FaucetComponent
          navigation={navigation}
          balances={Object.values(state.balances)}
        />
        {selected && (
          <SelectedTokenComponent token={selected} conversion={selectedPrice} />
        )}

        <SendReceiveButtonComponent
          color={selectedColor}
          onPress={handleSendReceive}
        />

        {/* @JESSE: below is from before: */}
        <View style={styles.topContainer}>
          <PortfolioComponent
            setPanelActive={() => setSelectedPanel('portfolio')}
            selectedAddress={selectedAddress}
            setSelected={setSelectedAddress}
            visible={selectedPanel === 'portfolio'}
          />
          <ActivityComponent
            navigation={navigation}
            setPanelActive={() => setSelectedPanel('transactions')}
            visible={selectedPanel === 'transactions'}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.darkPurple3,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  container: {
    marginTop: 10,
    marginHorizontal: 30,
  },
  topContainer: {
    marginHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.1,
    // shadowRadius: 10,
    elevation: 2,
  },
})
