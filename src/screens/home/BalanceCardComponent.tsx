import useContainerStyles from './useContainerStyles'
import { balanceToUSD, balanceToDisplay } from 'lib/utils'
import { IPrice } from 'src/subscriptions/types'
import BalanceCardPresentationComponent from './BalanceCardPresentationComponent'
import { BigNumber } from 'ethers'
import { useAppSelector } from 'store/storeUtils'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useMemo } from 'react'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

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
  const usdAmount = price
    ? balanceToUSD(token.balance, token.decimals, price?.price)
    : ''

  const balance = useMemo(
    () => balanceToDisplay(token.balance, token.decimals, 4),
    [token.balance, token.decimals],
  )
  const handlePress = () => onPress(token.contractAddress)

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

interface IBitcoinCardComponentProps {
  symbol: string
  balance: number
  isSelected: boolean
  contractAddress: string
  onPress: (address: string) => void
}

export const BitcoinCardComponent = ({
  symbol,
  balance,
  isSelected,
  contractAddress,
  onPress,
}: IBitcoinCardComponentProps) => {
  const containerStyles = useContainerStyles(isSelected, symbol)
  const balanceBigNumber = useMemo(
    () => BigNumber.from(Math.round(balance * 10e8)),
    [balance],
  )
  const prices = useAppSelector(selectUsdPrices)
  // Future TODO: should be set in the network constants if another coin is implemented
  const price = useMemo(() => {
    return prices.BTC ? balanceToUSD(balanceBigNumber, 8, prices.BTC.price) : ''
  }, [balanceBigNumber, prices.BTC])

  const balanceFormatted = useMemo(
    () => balanceToDisplay(balanceBigNumber.toString(), 8, 4),
    [balanceBigNumber],
  )
  const handlePress = () => {
    onPress(contractAddress)
  }
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
