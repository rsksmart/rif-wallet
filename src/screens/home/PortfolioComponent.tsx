import { View, ScrollView } from 'react-native'
import { useCallback, useState } from 'react'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'
import { BigNumber } from 'ethers'
import { useTranslation } from 'react-i18next'

import {
  balanceToDisplay,
  convertBalance,
  convertTokenToUSD,
  roundBalance,
} from 'lib/utils'

import { IPrice } from 'src/subscriptions/types'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

import { PortfolioCard } from 'components/Porfolio/PortfolioCard'
import { sharedColors } from 'shared/constants'
import { getTokenColor } from 'screens/home/tokenColor'

export const getBalance = (token: ITokenWithoutLogo | BitcoinNetwork) => {
  if (token instanceof BitcoinNetwork) {
    const bitcoinBalance: BitcoinNetwork = token
    const balanceBigNumber = BigNumber.from(
      Math.round(bitcoinBalance.balance * 10e8),
    )

    return balanceToDisplay(balanceBigNumber.toString(), 8, 4)
  } else {
    const tokenBalance: ITokenWithoutLogo = token
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
        return prices.BTC
          ? convertTokenToUSD(token.balance, prices.BTC.price)
          : 0
      } else {
        const tokenPrice = prices[token.contractAddress]
        return tokenPrice
          ? convertBalance(token.balance, token.decimals, tokenPrice.price)
          : 0
      }
    },
  )
  return roundBalance(
    usdBalances.reduce((a, b) => a + b, 0),
    2,
  )
}

interface Props {
  setSelectedAddress: (token: string) => void
  balances: Array<ITokenWithoutLogo | BitcoinNetwork>
  prices: Record<string, IPrice>
  selectedAddress?: string
}
const PortfolioComponent = ({
  selectedAddress,
  setSelectedAddress,
  balances,
  prices,
}: Props) => {
  const { t } = useTranslation()
  const handleSelectedAddress = useCallback(
    contractAddress => {
      setIsTotalCardSelected(false)
      setSelectedAddress(contractAddress)
    },
    [setSelectedAddress],
  )
  const [isTotalCardSelected, setIsTotalCardSelected] = useState<boolean>(true)

  return (
    <View>
      {/*TODO: This View above is a temporal fix to keep the ScrollView height*/}
      <ScrollView horizontal={true}>
        <PortfolioCard
          onPress={() => setIsTotalCardSelected(true)}
          color={sharedColors.inputInactive}
          primaryText={t('TOTAL')}
          secondaryText={`$${getTotalUsdBalance(balances, prices).toString()}`}
          isSelected={isTotalCardSelected}
        />
        {balances.map(
          (balance: ITokenWithoutLogo | BitcoinNetwork, i: number) => {
            const isSelected =
              selectedAddress === balance.contractAddress &&
              !isTotalCardSelected
            const color = isSelected
              ? getTokenColor(balance.symbol)
              : sharedColors.inputInactive
            const balanceToShow = getBalance(balance)
            return (
              <PortfolioCard
                key={i}
                onPress={() => handleSelectedAddress(balance.contractAddress)}
                color={color}
                primaryText={balance.symbol}
                secondaryText={balanceToShow}
                isSelected={isSelected}
                icon={balance.symbol}
              />
            )
          },
        )}
      </ScrollView>
    </View>
  )
}

export default PortfolioComponent
