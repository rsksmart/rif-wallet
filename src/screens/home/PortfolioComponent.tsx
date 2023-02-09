import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'
import { BigNumber } from 'ethers'
import { balanceToDisplay, convertBalance, convertTokenToUSD } from 'lib/utils'

import { colors } from 'src/styles'
import { IPrice } from 'src/subscriptions/types'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

import { PortfolioCard } from 'components/Porfolio/PortfolioCard'
import { sharedColors } from 'shared/constants'
import { getTokenColor } from 'screens/home/tokenColor'

interface Props {
  selectedAddress?: string
  setSelectedAddress: (token: string) => void
  balances: Array<ITokenWithoutLogo | BitcoinNetwork>
  prices: Record<string, IPrice>
}
const getBalance = (token: ITokenWithoutLogo | BitcoinNetwork) => {
  if (token instanceof BitcoinNetwork) {
    const bitcoinBalance: BitcoinNetwork = token as BitcoinNetwork
    const balanceBigNumber = BigNumber.from(
      Math.round(bitcoinBalance.balance * 10e8),
    )

    return balanceToDisplay(balanceBigNumber.toString(), 8, 4)
  } else {
    const tokenBalance: ITokenWithoutLogo = token as ITokenWithoutLogo
    return balanceToDisplay(tokenBalance.balance, tokenBalance.decimals, 4)
  }
}

const getTotalUsdBalance = (
  tokens: (ITokenWithoutLogo | BitcoinNetwork)[],
  prices: Record<string, IPrice>,
) => {
  const usdBalances = tokens.map(
    (token: ITokenWithoutLogo | BitcoinNetwork) => {
      if (token instanceof BitcoinNetwork) {
        const bitcoinBalance: BitcoinNetwork = token as BitcoinNetwork
        return prices.BTC
          ? convertTokenToUSD(bitcoinBalance.balance, prices.BTC.price)
          : 0
      } else {
        const tokenPrice = prices[token.contractAddress]
        return tokenPrice
          ? convertBalance(token.balance, token.decimals, tokenPrice.price)
          : 0
      }
    },
  )
  return usdBalances.reduce((a, b) => a + b, 0)
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
          handlePress={() => setSelectedAddress('')}
          color={sharedColors.darkGray}
          primaryText={'TOTAL'}
          secondaryText={`$${getTotalUsdBalance(balances, prices).toString()}`}
          isSelected={false}
        />
        {balances.map(
          (balance: ITokenWithoutLogo | BitcoinNetwork, i: number) => {
            const isSelected = selectedAddress === balance.contractAddress
            const color = isSelected
              ? getTokenColor(balance.symbol)
              : sharedColors.darkGray
            const balanceToShow = getBalance(balance)
            return (
              <View key={i}>
                <PortfolioCard
                  handlePress={() =>
                    setSelectedAddress(balance.contractAddress)
                  }
                  color={color}
                  primaryText={balance.symbol}
                  secondaryText={balanceToShow}
                  isSelected={isSelected}
                  icon={balance.symbol}
                />
              </View>
            )
          },
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
