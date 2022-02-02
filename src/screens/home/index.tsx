import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { constants } from 'ethers'

import { ScreenProps } from '../../RootNavigation'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import SelectedTokenComponent from './SelectedTokenComponent'
import LinearGradient from 'react-native-linear-gradient'
import { getTokenColor, setOpacity } from './tokenColor'
import PortfolioComponent from './PortfolioComponent'
import ActivityComponent from './ActivityComponent'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import FaucetComponent from './FaucetComponent'
import { ScrollView } from 'react-native-gesture-handler'
import { ScreenWithWallet } from '../types'

export const HomeScreen: React.FC<ScreenProps<'Home'> & ScreenWithWallet> = ({
  navigation,
  wallet,
}) => {
  const { state, dispatch } = useSocketsState()

  const [selected, setSelected] = useState<ITokenWithBalance | null>(null)

  const [selectedPanel, setSelectedPanel] = useState<string>('portfolio')

  const loadRBTCBalance = async () => {
    const rbtcBalanceEntry = await wallet.provider!.getBalance(
      wallet.smartWallet.address,
    )

    const newEntry = {
      name: 'TRBTC',
      logo: 'TRBTC',
      symbol: 'TRBTC',
      contractAddress: constants.AddressZero,
      decimals: 18,
      balance: rbtcBalanceEntry.toString(),
    } as ITokenWithBalance
    dispatch({ type: 'newBalance', payload: newEntry })
  }

  useEffect(() => {
    const balances = Object.values(state.balances)

    if (!selected) {
      setSelected(balances[0])
    }

    loadRBTCBalance().then(() => console.log('RTBC loaded'))
  }, [state.balances])

  const selectedTokenColor = getTokenColor(selected?.symbol)

  const containerStyles = {
    shadowColor: setOpacity(selectedTokenColor, 0.5),
  }
  //

  return (
    <LinearGradient
      colors={['#FFFFFF', setOpacity(selectedTokenColor, 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <FaucetComponent navigation={navigation} />
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
