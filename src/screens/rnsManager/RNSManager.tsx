import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'

import { BigNumber, utils } from 'ethers'
import { View, TextInput, ScrollView, Text } from 'react-native'
import { Button } from '../../components'

import { RSKRegistrar } from '../../lib/rns-rsk'

import { ScreenWithWallet } from '../types'
import { ScreenProps } from '../../RootNavigation'
import { getDomains } from '../../storage/DomainsStore'

export const RNSManagerScreen: React.FC<
  ScreenProps<'Activity'> & ScreenWithWallet
> = ({ wallet, navigation }) => {
  const [domainToLookUp, setDomainToLookUp] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedDomainAvailable, setSelectedDomainAvailable] = useState(false)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState('')
  const [registeredDomains, setRegisteredDomains] = useState([])

  const rskRegistrar = new RSKRegistrar(
    '0xca0a477e19bac7e0e172ccfd2e3c28a7200bdb71',
    '0x90734bd6bf96250a7b262e2bc34284b0d47c1e8d',
    '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    wallet,
  )

  const searchDomain = async (domain: string) => {
    setSelectedDomain('')
    const available = await rskRegistrar.available(domain)
    const price = await rskRegistrar.price(domainToLookUp, BigNumber.from(1))
    setSelectedDomainAvailable(available)
    setSelectedDomain(domain)
    setSelectedDomainPrice(utils.formatUnits(price, 18))
  }
  useEffect(() => {
    const callStorage = async () => {
      const domains = JSON.parse((await getDomains()) || '[]')
      setRegisteredDomains(domains)
      return domains
    }
    callStorage().then(domainsRegistered => console.log(domainsRegistered))
  }, [])

  return (
    <ScrollView>
      <TextInput
        value={domainToLookUp}
        onChangeText={setDomainToLookUp}
        placeholder={'Enter domain name...'}
      />
      <Button
        onPress={() => searchDomain(domainToLookUp)}
        title={'Search RSK Domain'}
      />
      {selectedDomain ? (
        <View style={styles.sectionCentered}>
          <Text style={styles.title}>{selectedDomain}.rsk</Text>
          {selectedDomainAvailable ? (
            <>
              <Text style={styles.green}>Available</Text>
              <Text>{`${selectedDomainPrice} RIF per year`}</Text>
              <Button
                onPress={() => {
                  navigation.navigate('RegisterDomain', selectedDomain)
                }}
                title={'Register'}
              />
            </>
          ) : (
            <Text style={styles.red}>Not Available</Text>
          )}
        </View>
      ) : null}
      <View style={styles.sectionCentered}>
        <Text style={styles.title}>Registered Domain</Text>
        {registeredDomains.map((registeredDomain: string) => (
          <Text key={registeredDomain}>{registeredDomain}</Text>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  sectionCentered: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
})
