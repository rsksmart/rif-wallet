import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { utils } from 'ethers'
import { jsonRpcProvider } from '../../lib/jsonRpcProvider'
import Button from '../../components/button'
import { Paragraph } from '../../components/typography'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

import { RIFWallet } from '../../lib/core'
import { RifWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import { roundBalance } from '../../lib/utils'

interface IReceiveScreenProps {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const BalancesScreen: React.FC<IReceiveScreenProps> = ({
  route,
  navigation,
}) => {
  const [smartAddress, setSmartAddress] = useState('')
  const [info, setInfo] = useState('')

  const [tokens, setTokens] = useState<ITokenWithBalance[]>([])
  const account = route.params.account as RIFWallet
  const fetcher: RifWalletServicesFetcher = new RifWalletServicesFetcher()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setTokens([])
      setInfo('Loading balances. Please wait...')
      const address = account.smartWalletAddress
      setSmartAddress(address)
      const fetchedtokens = await fetcher.fetchTokensByAddress(address)
      console.log({ fetchedtokens })
      const rbtcBalance = await jsonRpcProvider.getBalance(address)

      const rbtcToken: ITokenWithBalance = {
        name: 'TRBTC',
        logo: 'TRBTC',
        symbol: 'TRBTC',
        contractAddress: 'n/a',
        decimals: 18,
        balance: rbtcBalance.toString(),
      }
      setTokens([rbtcToken, ...fetchedtokens])
      setInfo('')
    } catch (e) {
      setInfo('Error reaching API: ' + e.message)
      console.log(e)
    }
  }

  return (
    <ScrollView>
      <View>
        <Paragraph>{smartAddress} </Paragraph>
      </View>

      {info ? (
        <View>
          <Text>{info} </Text>
        </View>
      ) : null}
      {tokens.map(token => (
        <View
          key={token.symbol}
          style={styles.tokenRow}
          testID={`${token.symbol}.View`}>
          <View style={styles.tokenBalance}>
            <Text>
              {token.symbol}{' '}
              {roundBalance(utils.formatUnits(token.balance, token.decimals))}
            </Text>
          </View>
          <View style={styles.button}>
            <Button
              onPress={() => {
                // @ts-ignore
                navigation.navigate('SendTransaction', {
                  account,
                  token: token.symbol,
                })
              }}
              title={'Send'}
              testID={`${token.symbol}.Button`}
            />
          </View>
        </View>
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

export default BalancesScreen
