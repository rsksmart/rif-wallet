import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image } from 'react-native'

import { NavigationProp } from '../../RootNavigation'
import SelectedTokenComponent from './SelectedTokenComponent'
import { getTokenColor } from './tokenColor'
import PortfolioComponent from './PortfolioComponent'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { colors } from '../../styles/colors'
import SendReceiveButtonComponent from './SendReceiveButtonComponent'
import { Paragraph } from '../../components'
import { useSelectedWallet } from '../../Context'

export const HomeScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { state } = useSocketsState()
  const { selectedWalletIndex } = useSelectedWallet()

  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined,
  )

  // token or undefined
  const selected = selectedAddress ? state.balances[selectedAddress] : undefined
  const selectedColor = getTokenColor(selected ? selected.symbol : undefined)
  const balances = Object.values(state.balances)

  useEffect(() => {
    if (!selected) {
      balances.length !== 0
        ? setSelectedAddress(balances[0].contractAddress)
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
        <SelectedTokenComponent
          token={selected}
          accountNumber={selectedWalletIndex}
        />
      )}

      <SendReceiveButtonComponent
        color={selectedColor}
        onPress={handleSendReceive}
        sendDisabled={balances.length === 0}
      />

      {balances.length === 0 && (
        <>
          <Image
            source={require('../../images/noBalance.png')}
            style={styles.noBalance}
          />
          <Paragraph style={styles.text}>
            You don't have any balances, get some here!
          </Paragraph>
        </>
      )}

      <PortfolioComponent
        selectedAddress={selectedAddress}
        setSelected={setSelectedAddress}
        balances={balances}
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
  text: {
    textAlign: 'center',
    color: colors.white,
  },
  noBalance: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
})
