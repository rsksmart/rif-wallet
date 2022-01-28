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

  const balances = Object.values(state.balances)

  const [selected, setSelected] = useState<ITokenWithBalance | null>(null)

  const [selectedPanel, setSelectedPanel] = useState<string>('portfolio')

  useEffect(() => {
    if (!selected) {
      setSelected(balances[0])
    }
  }, [balances])

  const selectedTokenColor = getTokenColor(selected?.symbol)

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
          rbtcBalance={0}
          rifBalance={0}
        />
        {selected && (
          <SelectedTokenComponent navigation={navigation} token={selected} />
        )}

        <LinearGradient
          colors={['#FFFFFF', '#E1E1E1']}
          style={{ ...styles.topContainer, ...containerStyles }}>
          <PortfolioComponent
            setPanelActive={() => setSelectedPanel('portfolio')}
            selected={selected}
            setSelected={setSelected}
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
