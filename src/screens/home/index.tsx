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

  // const [selected, setSelected] = useState<ITokenWithBalance | null>(null)
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
      console.log('@JESSE: no token was selected', state.balances[0])
      return setSelectedAddress(state.balances[0].contractAddress || undefined)
    }

    /*
    // check if the selected token is no longer in the wallet:
    if (!selectedToken.contractAddress) {
      console.log('@JESSE: selected token was not in the list')
      return setSelectedAddress(state.balances[0].contractAddress || undefined)
    }

    // check if the selected tokens balance was updated:

    // console.log('index: balances changed...', balances)
    // setSelected(balances[0])

    if (!selected) {
      setSelected(balances[0])
    }
    */
  }, [state.balances])

  const selectedTokenColor = getTokenColor(selectedToken.symbol)

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
        {selectedAddress && (
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
