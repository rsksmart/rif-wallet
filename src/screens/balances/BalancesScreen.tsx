import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { BigNumber, BigNumberish } from 'ethers'

import { IRIFWalletServicesFetcher } from 'lib/rifWalletServices/RifWalletServicesFetcher'
import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import { useSocketsState } from 'src/subscriptions/RIFSockets'

import {
  RootStackScreenProps,
  RootStackNavigationProp,
} from 'navigation/rootNavigator/types'
import { Address, Button } from 'src/components'
import { ScreenWithWallet } from '../types'

export const balanceToString = (
  balance: string,
  numberOfDecimals: BigNumberish,
) => {
  const pot = BigNumber.from('10').pow(numberOfDecimals)
  const parts = {
    integerPart: BigNumber.from(balance).div(pot).toString(),
    decimalPart: BigNumber.from(balance)
      .mod(pot)
      .toString()
      .padStart(Number(numberOfDecimals.toString()), '0')
      .slice(0, 4),
  }

  return `${parts.integerPart}.${parts.decimalPart}`
}

export const BalancesRow = ({
  token: { symbol, balance, decimals, contractAddress },
  navigation,
}: {
  token: ITokenWithBalance
  navigation: RootStackNavigationProp
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
          navigation.navigate('Send', {
            token: symbol,
          })
        }}
        title={'Send'}
        testID={`${contractAddress}.SendButton`}
      />
    </View>
  </View>
)

export type BalancesScreenProps = { fetcher: IRIFWalletServicesFetcher }

type Props = RootStackScreenProps<'Balances'> &
  ScreenWithWallet &
  BalancesScreenProps

export const BalancesScreen = ({ navigation, wallet }: Props) => {
  const { state } = useSocketsState()

  return (
    <ScrollView>
      <View>
        <Address>{wallet.smartWalletAddress}</Address>
      </View>
      <View>
        {Object.values(state.balances).map(token => (
          <BalancesRow
            key={token.contractAddress}
            token={token}
            navigation={navigation}
          />
        ))}
      </View>
    </ScrollView>
  )
}

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
