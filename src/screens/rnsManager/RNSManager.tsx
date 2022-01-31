import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import addresses from './addresses.json'
import LinearGradient from 'react-native-linear-gradient'

import { BigNumber, utils } from 'ethers'
import { View, TextInput, Text } from 'react-native'

import { RSKRegistrar } from '@rsksmart/rns-sdk'

import { ScreenWithWallet } from '../types'
import { ScreenProps } from '../../RootNavigation'
import { getDomains } from '../../storage/DomainsStore'
import { grid } from '../../styles/grid'
import { SquareButton } from '../../components/button/SquareButton'
import { getTokenColor, getTokenColorWithOpacity } from '../home/tokenColor'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { RegisterIcon } from '../../components/icons/RegisterIcon'

export const RNSManagerScreen: React.FC<
  ScreenProps<'Activity'> & ScreenWithWallet
> = ({ wallet, navigation }) => {
  const [domainToLookUp, setDomainToLookUp] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedDomainAvailable, setSelectedDomainAvailable] = useState(false)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState('')
  const [registeredDomains, setRegisteredDomains] = useState([])

  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )

  const searchDomain = async (domain: string) => {
    setSelectedDomain('')
    const available = await rskRegistrar.available(domain)
    const price = await rskRegistrar.price(domainToLookUp, BigNumber.from(1))

    setSelectedDomainAvailable(JSON.parse(available))
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
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity('TRBTC', 0.1)]}
      style={styles.parent}>
      <View style={styles.container} />
      <View style={grid.row}>
        <View style={{ ...grid.column8 }}>
          <TextInput
            style={styles.input}
            onChangeText={setDomainToLookUp}
            value={domainToLookUp}
            placeholder={'Enter domain name...'}
          />
        </View>
        <View style={{ ...grid.column2 }}>
          <Text style={styles.domain}>.rsk</Text>
        </View>
        <View style={{ ...grid.column2 }}>
          <View style={styles.centerRow}>
            <SquareButton
              // @ts-ignore
              onPress={() => searchDomain(domainToLookUp)}
              title=" "
              testID="Address.CopyButton"
              icon={<SearchIcon color={getTokenColor('TRBTC')} />}
            />
          </View>
        </View>
      </View>

      {selectedDomain ? (
        <View style={styles.sectionCentered}>
          <Text style={styles.domainTitle}>{selectedDomain}.rsk</Text>
          {selectedDomainAvailable ? (
            <>
              <Text style={styles.green}>Available</Text>
              <Text>{`${selectedDomainPrice} RIF per year`}</Text>

              <SquareButton
                // @ts-ignore
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('RegisterDomain', selectedDomain)
                }}
                title="Register"
                icon={<RegisterIcon color={getTokenColor('TRBTC')} />}
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
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    paddingTop: 20,
  },
  domain: {
    fontSize: 30,
    top: 15,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tinyLogo: {
    padding: 20,
    width: 200,
    height: 200,
  },
  centerRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    height: 50,
    marginTop: 10,
    margin: 10,
  },

  sectionCentered: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
  domainTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
})
