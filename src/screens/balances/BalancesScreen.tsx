import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { BigNumber, BigNumberish, constants } from 'ethers'

import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { useTranslation } from 'react-i18next'
import { useSocketsState } from '../../subscriptions/RIFSockets'

import { ScreenProps, NavigationProp } from '../../RootNavigation'
import { Address, Button } from '../../components'
import { ScreenWithWallet } from '../types'

export const balanceToString = (balance: string, decimals: BigNumberish) => {
  const parts = {
    div: BigNumber.from(balance).div(BigNumber.from('10').pow(decimals)),
    mod: BigNumber.from(balance).mod(BigNumber.from('10').pow(decimals)),
  }

  return `${parts.div.toString()}.${parts.mod.toString().slice(0, 4)}`
}

export const BalancesRow = ({
  token: { symbol, balance, decimals, contractAddress },
  navigation,
}: {
  token: ITokenWithBalance
  navigation: NavigationProp
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

export const BalancesScreen: React.FC<
  ScreenProps<'Balances'> & ScreenWithWallet & BalancesScreenProps
> = ({ navigation, wallet }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  const { state, dispatch } = useSocketsState()

  const loadRBTCBalance = async () => {
    setIsLoading(true)

    const rbtcBalanceEntry = await wallet
      .provider!.getBalance(wallet.smartWallet.address)
      .then(
        rbtcBalance =>
          ({
            name: 'TRBTC',
            logo: 'TRBTC',
            symbol: 'TRBTC (eoa wallet)',
            contractAddress: constants.AddressZero,
            decimals: 18,
            balance: rbtcBalance.toString(),
          } as ITokenWithBalance),
      )
    dispatch({ type: 'newBalance', payload: rbtcBalanceEntry })
    setIsLoading(false)
  }

  useEffect(() => {
    loadRBTCBalance()
  }, [])

  return (
    <ScrollView>
      <View>
        <Address>{wallet.smartWalletAddress}</Address>
      </View>

      <View>
        <Text testID="Info.Text">
          {isLoading ? t('Loading balances. Please wait...') : ''}
        </Text>
      </View>

      <View>
        {!isLoading &&
          Object.values(state.balances).map(token => (
            <BalancesRow
              key={token.contractAddress}
              token={token}
              navigation={navigation}
            />
          ))}
      </View>

      <View style={styles.refreshButtonView}>
        <Button
          onPress={loadRBTCBalance}
          title={t('Refresh')}
          testID={'Refresh.Button'}
        />
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
