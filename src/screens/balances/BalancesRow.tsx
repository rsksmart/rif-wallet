import { View, Text, StyleSheet } from 'react-native'

import { balanceToString } from './BalancesScreen'
import { Button } from 'components/index' // TODO: this button seems like it doesn't exist
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'

export const BalancesRow = ({
  token: { symbol, balance, decimals, contractAddress },
  navigation,
}: {
  token: ITokenWithoutLogo
  navigation: HomeStackScreenProps<homeStackRouteNames.Balances>['navigation']
}) => (
  <View style={styles.tokenRow} testID={`${contractAddress}.View`}>
    <View style={styles.tokenBalance}>
      <Text testID={`${contractAddress}.Text`}>
        {`${balanceToString(balance, decimals || 0)} ${symbol}`}
      </Text>
    </View>
    <View style={styles.button}>
      <Button
        onPress={() => {
          navigation.navigate(homeStackRouteNames.Send, {
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
