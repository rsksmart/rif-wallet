import { StyleSheet, View } from 'react-native'

import { Button, RegularText } from 'src/components'
import {
  RootStackNavigationProp,
  rootStackRouteNames,
} from 'src/navigation/rootNavigator'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { balanceToString } from './BalancesScreen'

export const BalancesRow = ({
  token: { symbol, balance, decimals, contractAddress },
  navigation,
}: {
  token: ITokenWithoutLogo
  navigation: RootStackNavigationProp
}) => (
  <View style={styles.tokenRow} testID={`${contractAddress}.View`}>
    <View style={styles.tokenBalance}>
      <RegularText testID={`${contractAddress}.Text`}>
        {`${balanceToString(balance, decimals || 0)} ${symbol}`}
      </RegularText>
    </View>
    <View style={styles.button}>
      <Button
        onPress={() => {
          navigation.navigate(rootStackRouteNames.Send, {
            token: symbol,
          })
        }}
        title={'Send'}
        testID={`${contractAddress}.SendButton`}
      />
    </View>
  </View>
)

const styles = StyleSheet.create({
  tokenRow: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  tokenBalance: {
    position: 'absolute',
    left: 0,
  },
  button: {
    position: 'absolute',
    right: 0,
  },
  refreshButtonView: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
})
