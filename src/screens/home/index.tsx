import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { NavigationProp } from '../../RootNavigation'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import SelectedTokenComponent from './SelectedTokenComponent'
import balances from './tempBalances.json'
import { BalanceRowComponent } from './BalanceRowComponent'
import { Paragraph } from '../../components'

export const HomeScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const [selected, setSelected] = useState<ITokenWithBalance>(
    balances[0] as ITokenWithBalance,
  )

  return (
    <View>
      <SelectedTokenComponent navigation={navigation} token={selected} />

      <View style={styles.container}>
        <View style={styles.portfolio}>
          <Paragraph>portfolio</Paragraph>
          {balances.map((token: any) => (
            <BalanceRowComponent
              selected={selected.contractAddress === token.contractAddress}
              token={token}
              onPress={() => setSelected(token)}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    marginHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#ffffff',
  },
  portfolio: {},
})
