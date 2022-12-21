import { BigNumber } from 'ethers'
import { useCallback, useEffect, useMemo } from 'react'

import { balanceToUSD, balanceToDisplay } from 'lib/utils'

import { useContainerStyles } from './useContainerStyles'
import { IPrice } from 'src/subscriptions/types'
import { BalanceCardPresentationComponent } from './BalanceCardPresentationComponent'
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
  price,
}: IBalanceCardComponentProps) => {
  const containerStyles = useContainerStyles(selected, token.symbol)
  const { tokenBalance, decimals, contactAddress } = useMemo(
    () => ({
      tokenBalance: token.balance,
      decimals: token.decimals,
      contactAddress: token.contractAddress,
    }),
    [token],
  )
  const usdAmount = useMemo(
    () => (price ? balanceToUSD(tokenBalance, decimals, price.price) : ''),
    [price, tokenBalance, decimals],
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
    <BalanceCardPresentationComponent
      handlePress={handlePress}
      containerStyles={containerStyles}
      symbol={token.symbol}
      balance={balance}
      usdAmount={usdAmount}
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
  prices,
}: BitcoinCardComponentProps) => {
  const containerStyles = useContainerStyles(isSelected, symbol)
  const balanceBigNumber = useMemo(
    () => BigNumber.from(Math.round(balance * 10e8)),
    [balance],
  )
  // Future TODO: should be set in the network constants if another coin is implemented
  const price = useMemo(() => {
    return prices.BTC
      ? balanceToUSD(balanceBigNumber, 8, prices.BTC.price)
      : // TODO: fix this for bitcoin, prices don't have BTC field
        '1'
  }, [prices.BTC, balanceBigNumber])

  const balanceFormatted = useMemo(
    () => balanceToDisplay(balanceBigNumber.toString(), 8, 4),
    [balanceBigNumber],
  )
  const handlePress = useCallback(() => {
    onPress(contractAddress)
  }, [contractAddress, onPress])

  useEffect(() => {
    console.log('PRICE CHANGE', price)
  }, [price])

  return (
    <BalanceCardPresentationComponent
      handlePress={handlePress}
      containerStyles={containerStyles}
      symbol={symbol}
      balance={balanceFormatted}
      usdAmount={price}
    />
  )
}
