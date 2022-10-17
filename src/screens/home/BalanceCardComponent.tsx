import React from 'react'
import useContainerStyles from './useContainerStyles'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { balanceToUSD, balanceToDisplay } from '../../lib/utils'
import { IPrice } from '../../subscriptions/types'
import BalanceCardPresentationComponent from './BalanceCardPresentationComponent'
import { BigNumber } from 'ethers'

export const BalanceCardComponent: React.FC<{
  token: ITokenWithBalance
  selected: boolean
  onPress: (address: string) => void
  price?: IPrice
}> = ({ selected, token, onPress, price }) => {
  const containerStyles = useContainerStyles(selected, token.symbol)
  const usdAmount = price
    ? balanceToUSD(token.balance, token.decimals, price?.price)
    : ''

  const balance = React.useMemo(
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

export const BitcoinCardComponent: React.FC<{
  symbol: string
  balance: number
  isSelected: boolean
  contractAddress: string
  onPress: (address: string) => void
}> = ({ symbol, balance, isSelected, contractAddress, onPress }) => {
  const containerStyles = useContainerStyles(isSelected, symbol)

  const balanceFormatted = React.useMemo(
    () => balanceToDisplay(BigNumber.from((balance * 10e8).toString()), 8, 4),
    [balance],
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
    />
  )
}
