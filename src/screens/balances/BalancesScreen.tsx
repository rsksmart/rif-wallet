import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { utils } from 'ethers'

import { RifWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { jsonRpcProvider } from '../../lib/jsonRpcProvider'
import { roundBalance } from '../../lib/utils'

import { ScreenProps, NavigationProp } from '../../RootNavigation'
import { Button, Paragraph } from '../../components'
import { ScreenWithWallet } from '../types'

const fetcher: RifWalletServicesFetcher = new RifWalletServicesFetcher()

export const BalancesRow = ({
  token: { symbol, balance, decimals },
  navigation,
}: {
  token: ITokenWithBalance
  navigation: NavigationProp
}) => (
  <View style={styles.tokenRow} testID={`${symbol}.View`}>
    <View style={styles.tokenBalance}>
      <Text>
        {symbol} {roundBalance(utils.formatUnits(balance, decimals))}
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
        testID={`${symbol}.Button`}
      />
    </View>
  </View>
)

export const BalancesScreen: React.FC<
  ScreenProps<'Balances'> & ScreenWithWallet
> = ({ navigation, wallet }) => {
  const [info, setInfo] = useState('')
  const [tokens, setTokens] = useState<ITokenWithBalance[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setTokens([])
      setInfo('Loading balances. Please wait...')

      const fetchedTokens = await fetcher.fetchTokensByAddress(
        wallet.smartWalletAddress,
      )
      const rbtcBalance = await jsonRpcProvider.getBalance(
        wallet.smartWallet.wallet.address,
      )

      const rbtcToken: ITokenWithBalance = {
        name: 'TRBTC',
        logo: 'TRBTC',
        symbol: 'TRBTC (eoa wallet)',
        contractAddress: 'n/a',
        decimals: 18,
        balance: rbtcBalance.toString(),
      }

      setTokens([rbtcToken, ...fetchedTokens])
      setInfo('')
    } catch (e) {
      setInfo('Error reaching API: ' + e.message)
    }
  }

  return (
    <ScrollView>
      <View>
        <Paragraph>{wallet.smartWalletAddress}</Paragraph>
      </View>

      <View>
        <Text>{info}</Text>
      </View>

      {tokens &&
        tokens.map(token => (
          <BalancesRow
            key={token.contractAddress}
            token={token}
            navigation={navigation}
          />
        ))}

      <View style={styles.refreshButtonView}>
        <Button onPress={loadData} title={'Refresh'} />
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
