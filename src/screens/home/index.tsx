import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

import { NavigationProp } from '../../RootNavigation'
import SelectedTokenComponent from './SelectedTokenComponent'
import LinearGradient from 'react-native-linear-gradient'
import { getTokenColor, setOpacity } from './tokenColor'
import PortfolioComponent from './PortfolioComponent'
import ActivityComponent from './ActivityComponent'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import FaucetComponent from './FaucetComponent'
import { ScrollView } from 'react-native-gesture-handler'
import PendingActivityComponent from './PendingActivityComponent'

export const HomeScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { state } = useSocketsState()

  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    undefined,
  )

  // token or undefined
  const selected = selectedAddress ? state.balances[selectedAddress] : undefined

  const [selectedPanel, setSelectedPanel] = useState<string>('portfolio')

  useEffect(() => {
    if (!selected) {
      Object.values(state.balances).length !== 0
        ? setSelectedAddress(Object.values(state.balances)[0].contractAddress)
        : undefined
    }
  }, [state.balances])

  const selectedTokenColor = selected
    ? getTokenColor(selected.symbol)
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
        {selected && (
          <SelectedTokenComponent navigation={navigation} token={selected} />
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
          <PendingActivityComponent
            navigation={navigation}
            setPanelActive={() => setSelectedPanel('pendingTransactions')}
            visible={selectedPanel === 'pendingTransactions'}
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
