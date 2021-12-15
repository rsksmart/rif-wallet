import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { NavigationProp } from '../../RootNavigation'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import SelectedTokenComponent from './SelectedTokenComponent'
import balances from './tempBalances.json'
import { BalanceRowComponent } from './BalanceRowComponent'
import { Paragraph } from '../../components'
import LinearGradient from 'react-native-linear-gradient'
import { getTokenColor, setOpacity } from './tokenColor'

export const HomeScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const [selected, setSelected] = useState<ITokenWithBalance>(
    balances[0] as ITokenWithBalance,
  )

  const selectedTokenColor = getTokenColor(selected.symbol)

  const containerStyles = {
    ...styles.container,
    shadowColor: setOpacity(selectedTokenColor, 0.5),
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', setOpacity(selectedTokenColor, 0.1)]}
      style={styles.parent}>
      <SelectedTokenComponent navigation={navigation} token={selected} />

      <View style={containerStyles}>
        <View style={styles.portfolio}>
          <Paragraph>portfolio</Paragraph>
          {balances.map((token: any) => (
            <BalanceRowComponent
              key={token.contractAddress}
              selected={selected.contractAddress === token.contractAddress}
              token={token}
              onPress={() => setSelected(token)}
            />
          ))}
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
  container: {
    marginHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#ffffff',

    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  portfolio: {
    paddingHorizontal: 25,
  },
})
