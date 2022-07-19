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
import { LoadingScreen } from '../../components/loading/LoadingScreen'

export type HomeScreenProps = {
  navigation: NavigationProp
  changeTopColor: (color: string) => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  changeTopColor,
}) => {
  const { state } = useSocketsState()
  const { selectedWalletIndex } = useSelectedWallet()

  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined,
  )

  // token or undefined
  const selected = selectedAddress ? state.balances[selectedAddress] : undefined
  const selectedColor = getTokenColor(selected ? selected.symbol : undefined)
  const balances = Object.values(state.balances)
  const backGroundColor = {
    backgroundColor: selectedAddress ? selectedColor : colors.darkPurple3,
  }

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

  // pass the new color to Core to update header:
  useEffect(() => {
    changeTopColor(selectedColor)
  }, [selectedColor])

  // waiting for the balances to load:
  if (!state.isSetup) {
    return <LoadingScreen />
  }

  return (
    <View style={styles.container}>
      <View style={{ ...styles.topColor, ...backGroundColor }} />
      <View style={styles.bottomColor} />

      <View style={styles.parent}>
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

        {balances.length === 0 ? (
          <>
            <Image
              source={require('../../images/noBalance.png')}
              style={styles.noBalance}
            />
            <Paragraph style={styles.text}>
              You don't have any balances, get some here!
            </Paragraph>
          </>
        ) : (
          <PortfolioComponent
            selectedAddress={selectedAddress}
            setSelected={setSelectedAddress}
            balances={balances}
            prices={state.prices}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.darkPurple3,
  },
  topColor: {
    flex: 1,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  bottomColor: {
    flex: 5,
  },

  parent: {
    position: 'absolute',
    width: '100%',
    height: '100%',

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
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
