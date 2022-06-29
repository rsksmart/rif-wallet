import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { BigNumber, BigNumberish } from 'ethers'

import { IRIFWalletServicesFetcher,ITokenWithBalance } from 'rif-wallet/packages/types'
import { useTranslation } from 'react-i18next'

import { ScreenProps, NavigationProp } from '../../RootNavigation'
import { Address, Button } from '../../components'
import { ScreenWithWallet } from '../types'
import { RIFWallet } from '../../lib/core'

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
        {`${balanceToString(balance, decimals)} ${symbol}`}
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

async function getTokensAndRBTCBalance(
  fetcher: IRIFWalletServicesFetcher,
  wallet: RIFWallet,
): Promise<ITokenWithBalance[]> {
  const tokenBalances = await fetcher.fetchTokensByAddress(
    wallet.smartWalletAddress,
  )
  const rbtcBalanceEntry = await wallet
    .provider!.getBalance(wallet.smartWallet.address)
    .then(
      rbtcBalance =>
        ({
          name: 'TRBTC',
          logo: 'TRBTC',
          symbol: 'TRBTC (eoa wallet)',
          contractAddress: 'RBTC',
          decimals: 18,
          balance: rbtcBalance.toString(),
        } as ITokenWithBalance),
    )

  return [rbtcBalanceEntry, ...tokenBalances]
}

export type BalancesScreenProps = { fetcher: IRIFWalletServicesFetcher }

export const BalancesScreen: React.FC<
  ScreenProps<'Balances'> & ScreenWithWallet & BalancesScreenProps
> = ({ navigation, wallet, fetcher }) => {
  const [info, setInfo] = useState('')
  const [balances, setBalances] = useState<ITokenWithBalance[]>([])
  const { t } = useTranslation()

  const loadData = async () => {
    setInfo(t('Loading balances. Please wait...'))
    setBalances([])

    await getTokensAndRBTCBalance(fetcher, wallet)
      .then(newBalances => {
        setBalances(newBalances)
        setInfo('')
      })
      .catch(e => {
        setInfo('Error reaching API: ' + e.message)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <ScrollView>
      <View>
        <Address>{wallet.smartWalletAddress}</Address>
      </View>

      <View>
        <Text testID="Info.Text">{info}</Text>
      </View>

      <View>
        {balances.map(token => (
          <BalancesRow
            key={token.contractAddress}
            token={token}
            navigation={navigation}
          />
        ))}
      </View>

      <View style={styles.refreshButtonView}>
        <Button
          onPress={loadData}
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
