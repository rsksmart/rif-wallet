import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import { NavigationProp } from '../../RootNavigation'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import SelectedTokenComponent from './SelectedTokenComponent'
import balances from './tempBalances.json'
import LinearGradient from 'react-native-linear-gradient'
import { getTokenColor, setOpacity } from './tokenColor'
import PortfolioComponent from './PortfolioComponent'
import ActivityComponent from './ActivityComponent'

export const HomeScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const [selected, setSelected] = useState<ITokenWithBalance>(
    balances[0] as ITokenWithBalance,
  )
  const [selectedPanel, setSelectedPanel] = useState<string>('portfolio')

  const selectedTokenColor = getTokenColor(selected.symbol)

  const containerStyles = {
    shadowColor: setOpacity(selectedTokenColor, 0.5),
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', setOpacity(selectedTokenColor, 0.1)]}
      style={styles.parent}>
      <SelectedTokenComponent navigation={navigation} token={selected} />

      <LinearGradient
        colors={['#FFFFFF', '#E1E1E1']}
        style={{ ...styles.topContainer, ...containerStyles }}>
        <PortfolioComponent
          setPanelActive={() => setSelectedPanel('portfolio')}
          balances={balances}
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
