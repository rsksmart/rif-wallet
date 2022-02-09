import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

import { NavigationProp } from '../../RootNavigation'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import SelectedTokenComponent from './SelectedTokenComponent'
import LinearGradient from 'react-native-linear-gradient'
import { getTokenColor, setOpacity } from './tokenColor'
import PortfolioComponent from './PortfolioComponent'
import ActivityComponent from './ActivityComponent'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import FaucetComponent from './FaucetComponent'
import { ScrollView } from 'react-native-gesture-handler'

export const HomeScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { state } = useSocketsState()

  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined,
  )
  // token or undefined
  const selectedToken = Object.values(state.balances).filter(
    (t: ITokenWithBalance) => t.contractAddress === selectedAddress,
  )[0]

  const [selectedPanel, setSelectedPanel] = useState<string>('portfolio')

  useEffect(() => {
    // no token is selected, or the selectedToken is undefined choose the first:
    if (!selectedToken) {
      Object.values(state.balances).length !== 0
        ? setSelectedAddress(Object.values(state.balances)[0].contractAddress)
        : undefined
    }
  }, [state.balances])

  console.log({ selectedToken })
  const selectedTokenColor = selectedToken
    ? getTokenColor(selectedToken.symbol)
    : '#CCCCCC'

  const containerStyles = {
    shadowColor: setOpacity(selectedTokenColor, 0.5),
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', setOpacity(selectedTokenColor, 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <FaucetComponent
          navigation={navigation}
          balances={Object.values(state.balances)}
        />
        {selectedToken && (
          <SelectedTokenComponent
            navigation={navigation}
            token={selectedToken}
          />
        )}

        <LinearGradient
          colors={['#FFFFFF', '#E1E1E1']}
          style={{ ...styles.topContainer, ...containerStyles }}>
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
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
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
