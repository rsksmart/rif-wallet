import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { utils } from 'ethers'

import Button from '../../components/button'
import { Paragraph } from '../../components/typography'
import { ITokenWithBalance } from './RIFWalletServicesTypes'
import Account from '../../lib/core/Account'

interface IReceiveScreenProps {
  route: any
}

const BalancesScreen: React.FC<IReceiveScreenProps> = ({ route }) => {
  const [smartAddress, setSmartAddress] = useState('')
  const [tokens, setTokens] = useState<ITokenWithBalance[]>([])
  const account = route.params.account as Account

  useEffect(() => {
    const loadData = async () => {
      const address = await account.getSmartAddress()
      setSmartAddress(address)
      fetchTokensByAddress()
    }

    loadData()
  }, [])

  const fetchTokensByAddress = () => {
    console.log({ smartAddress })
    return fetch(
      'http://10.0.2.2:3000/address/0x4a727d7943b563462c96d40689836600d20b983b/tokens',
    )
      .then(response => response.json())
      .then((tokens: ITokenWithBalance[]) => {
        setTokens(tokens)
        console.log({ tokens })
      })
      .catch(error => {
        console.error(error)
      })
  }
  const roundUp = (num: string) => {
    const number = parseFloat(num)
    return Math.round(number * 100) / 100
  }
  return (
    <ScrollView>
      <View>
        <Paragraph>{smartAddress} </Paragraph>
      </View>

      {tokens.length === 0 && <Paragraph>Loading Balances... </Paragraph>}
      {tokens.map(token => (
        <View key={token.symbol} style={styles.tokenRow}>
          <View style={{ position: 'absolute', left: 0 }}>
            <Text>
              {token.symbol}{' '}
              {roundUp(utils.formatUnits(token.balance, token.decimals))}
            </Text>
          </View>
          <View style={{ position: 'absolute', right: 0 }}>
            <Button onPress={() => {}} title={'Send'} />
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  tokenRow: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  button: {
    right: 0,
  },
})

export default BalancesScreen
