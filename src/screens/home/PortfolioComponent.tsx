import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'

import { RegularText } from 'components/index'
import { colors, grid } from 'src/styles'
import { IPrice } from 'src/subscriptions/types'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

import {
  BalanceCardComponent,
  BitcoinCardComponent,
} from './BalanceCardComponent'

interface Props {
  selectedAddress?: string
  setSelectedAddress: (token: string) => void
  balances: Array<ITokenWithoutLogo | BitcoinNetwork>
  prices: Record<string, IPrice>
}

const PortfolioComponent = ({
  selectedAddress,
  setSelectedAddress,
  balances,
  prices,
}: Props) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={grid.row}>
        <RegularText style={styles.heading}>portfolio</RegularText>
      </View>
      <View style={styles.scrollView}>
        {balances.map(
          (balance: ITokenWithoutLogo | BitcoinNetwork, i: number) => (
            <View
              style={i % 2 ? styles.rightColumn : styles.leftColumn}
              key={i}>
              {balance instanceof BitcoinNetwork ? (
                <BitcoinCardComponent
                  {...balance}
                  isSelected={selectedAddress === balance.contractAddress}
                  onPress={setSelectedAddress}
                  prices={prices}
                />
              ) : (
                <BalanceCardComponent
                  token={balance}
                  onPress={setSelectedAddress}
                  selected={selectedAddress === balance.contractAddress}
                  price={prices[balance.contractAddress]}
                />
              )}
            </View>
          ),
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  heading: {
    ...grid.column12,
    color: colors.lightPurple,
    fontSize: 16,
    margin: 5,
  },
  balances: {
    borderWidth: 1,
    borderColor: '#FFCC33',
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 500,
  },
  leftColumn: {
    ...grid.column6,
    paddingRight: 10,
  },
  rightColumn: {
    ...grid.column6,
    paddingLeft: 10,
  },

  scrollView: {
    ...grid.row,
    flexWrap: 'wrap',
    width: '100%',
  },
  container: {
    borderWidth: 1,
    borderColor: '#FFCC33',
  },
  emptyState: {
    paddingBottom: 20,
  },
})

export default PortfolioComponent
