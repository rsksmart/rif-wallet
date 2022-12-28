import { View, ScrollView } from 'react-native'
import { BigNumber, BigNumberish } from 'ethers'

import { IRIFWalletServicesFetcher } from 'lib/rifWalletServices/RifWalletServicesFetcher'

import { Address } from 'components/index'
import { ScreenWithWallet } from '../types'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { useAppSelector } from 'store/storeUtils'
import { BalancesRow } from './BalancesRow'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'src/navigation/homeNavigator/types'

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

export type BalancesScreenProps = { fetcher: IRIFWalletServicesFetcher }

type Props = HomeStackScreenProps<homeStackRouteNames.Balances> &
  ScreenWithWallet &
  BalancesScreenProps

export const BalancesScreen = ({ navigation, wallet }: Props) => {
  const balances = useAppSelector(selectBalances)
  return (
    <ScrollView>
      <View>
        <Address>{wallet.smartWalletAddress}</Address>
      </View>
      <View>
        {Object.values(balances).map(token => (
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
