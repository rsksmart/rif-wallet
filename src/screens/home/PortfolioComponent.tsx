import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'

import { colors } from 'src/styles'
import { IPrice } from 'src/subscriptions/types'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

import {
  BalanceCardComponent,
  BitcoinCardComponent,
} from './BalanceCardComponent'
import { PortfolioCard } from 'screens/home/PortfolioCard'
import { sharedColors } from 'shared/constants'

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
    <ScrollView horizontal={true} contentContainerStyle={styles.scrollView}>
      <View style={styles.scrollView}>
        <PortfolioCard
          handlePress={() => {}}
          color={sharedColors.darkGray}
          primaryText={'TOTAL'}
          secondaryText={'233.2'}
          isSelected={false}
        />
        {balances.map(
          (balance: ITokenWithoutLogo | BitcoinNetwork, i: number) => (
            <View key={i}>
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
    color: colors.lightPurple,
    fontSize: 16,
    margin: 5,
  },
  scrollView: {
    flexDirection: 'row',
    height: 110,
  },
  emptyState: {
    paddingBottom: 20,
  },
})

export default PortfolioComponent
