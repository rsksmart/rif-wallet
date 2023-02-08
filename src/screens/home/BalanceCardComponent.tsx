import { BigNumber } from 'ethers'
import { useCallback, useMemo } from 'react'

import { balanceToDisplay } from 'lib/utils'

import { useTokenColor } from './useTokenColor'
import { IPrice } from 'src/subscriptions/types'
import { PortfolioCard } from './PortfolioCard'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { UsdPricesState } from 'store/slices/usdPricesSlice/types'

interface IBalanceCardComponentProps {
  token: ITokenWithoutLogo
  selected: boolean
  onPress: (address: string) => void
  price?: IPrice
}

export const BalanceCardComponent = ({
  selected,
  token,
  onPress,
}: /*price,*/
IBalanceCardComponentProps) => {
  const activeColor = useTokenColor(selected, token.symbol)
  const { tokenBalance, decimals, contactAddress } = useMemo(
    () => ({
      tokenBalance: token.balance,
      decimals: token.decimals,
      contactAddress: token.contractAddress,
    }),
    [token],
  )


  const balance = useMemo(
    () => balanceToDisplay(tokenBalance, decimals, 4),
    [tokenBalance, decimals],
  )
  const handlePress = useCallback(
    () => onPress(contactAddress),
    [contactAddress, onPress],
  )

  return (
    <PortfolioCard
      handlePress={handlePress}
      color={activeColor}
      primaryText={token.symbol}
      secondaryText={balance}
      icon={token.symbol}
      isSelected={selected}
    />
  )
}

interface BitcoinCardComponentProps {
  symbol: string
  balance: number
  isSelected: boolean
  contractAddress: string
  prices: UsdPricesState
  onPress: (address: string) => void
}

export const BitcoinCardComponent = ({
  symbol,
  balance,
  isSelected,
  contractAddress,
  onPress,
}: /*prices,*/
BitcoinCardComponentProps) => {
  const activeColor = useTokenColor(isSelected, symbol)
  const balanceBigNumber = useMemo(
    () => BigNumber.from(Math.round(balance * 10e8)),
    [balance],
  )


  const balanceFormatted = useMemo(
    () => balanceToDisplay(balanceBigNumber.toString(), 8, 4),
    [balanceBigNumber],
  )
  const handlePress = useCallback(() => {
    onPress(contractAddress)
  }, [contractAddress, onPress])

  return (
    <PortfolioCard
      handlePress={handlePress}
      color={activeColor}
      primaryText={symbol}
      secondaryText={balanceFormatted}
      icon={symbol}
      isSelected={isSelected}
    />
  )
}
