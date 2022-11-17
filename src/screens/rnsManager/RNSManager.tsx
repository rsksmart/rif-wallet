import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import addresses from './addresses.json'
import LinearGradient from 'react-native-linear-gradient'

import { BigNumber, utils } from 'ethers'
import { View, TextInput, Text } from 'react-native'

import { RSKRegistrar } from '@rsksmart/rns-sdk'

import { ScreenWithWallet } from '../types'
import { RootStackScreenProps } from 'navigation/rootNavigator/types'
import { getDomains } from '../../storage/DomainsStore'
import { grid } from '../../styles'
import { SquareButton } from '../../components/button/SquareButton'
import { getTokenColor, getTokenColorWithOpacity } from '../home/tokenColor'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { RegisterIcon } from '../../components/icons/RegisterIcon'
import BaseButton from '../../components/button/BaseButton'
import { IProfileStore } from '../../storage/MainStorage'
type Props = {
  navigation: any
  profile: IProfileStore
  setProfile: (p: IProfileStore) => void
}
const years = 3

export const RNSManagerScreen: React.FC<
  RootStackScreenProps<'RNSManager'> & ScreenWithWallet & Props
> = ({ wallet, navigation, profile, setProfile }) => {
  const [domainToLookUp, setDomainToLookUp] = useState('')
  const [error, setError] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedDomainAvailable, setSelectedDomainAvailable] = useState(false)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState('')
  const [registeredDomains, setRegisteredDomains] = useState<string[]>([])

  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )

  useEffect(() => {
    setRegisteredDomains(getDomains(wallet.smartWalletAddress))
  }, [wallet])

  const searchDomain = async (domain: string) => {
    setSelectedDomain('')

    if (!/^[a-z0-9]*$/.test(domain)) {
      setError('Only lower cases and numbers are allowed')
      return
    }

    if (domain.length < 5) {
      setError('Only domains with 5 or more characters are allowed')
      return
    }

    setError('')

    const available = (await rskRegistrar.available(domain)) as any as boolean
    const price = await rskRegistrar.price(
      domainToLookUp,
      BigNumber.from(years),
    )

    setSelectedDomainAvailable(available)
    setSelectedDomain(domain)
    setSelectedDomainPrice(utils.formatUnits(price, 18))
  }
  const selectDomain = async (domain: string) => {
    await setProfile({
      ...profile,
      alias: domain,
    } as unknown as IProfileStore)

    navigation.navigate('ProfileCreateScreen', {
      navigation,
      profile: { alias: 'sample-domain.rsk' },
    })
  }

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
            autoCapitalize="none"
          />
        </View>
        <View style={{ ...grid.column2 }}>
          <Text style={styles.domain}>.rsk</Text>
        </View>
        <View style={{ ...grid.column2 }}>
          <View style={styles.centerRow}>
            <BaseButton
              testID={'Address.CopyButton'}
              onPress={() => searchDomain(domainToLookUp)}>
              <SearchIcon color={getTokenColor('TRBTC')} />
            </BaseButton>
          </View>
        </View>
      </View>

      {!!error && <Text style={styles.red}>{error}</Text>}

      {!!selectedDomain && (
        <View style={styles.sectionCentered}>
          <Text style={styles.domainTitle}>{selectedDomain}.rsk</Text>
          {selectedDomainAvailable ? (
            <>
              <Text style={styles.green}>Available</Text>
              <Text>{`${selectedDomainPrice} RIF for ${years} years`}</Text>

              <SquareButton
                onPress={() => {
                  navigation.navigate('RegisterDomain', {
                    selectedDomain,
                    years,
                  })
                }}
                title="Register"
                icon={<RegisterIcon color={getTokenColor('TRBTC')} />}
              />
            </>
          ) : (
            <Text style={styles.red}>Not Available</Text>
          )}
        </View>
      )}
      {registeredDomains.length > 0 && (
        <View style={styles.sectionCentered}>
          <Text style={styles.title}>Registered Domains</Text>
          {registeredDomains.map((registeredDomain: string) => (
            <View style={styles.sectionCentered}>
              <Text key={registeredDomain}>{registeredDomain}</Text>
            </View>
          ))}
        </View>
      )}
      {/*TODO: Remove this since this is temporal to enable domain selection */}
      <View style={styles.sectionCentered}>
        <TouchableOpacity onPress={() => selectDomain('sample-domain.rsk')}>
          <Text key={'hardcoded'}>{'sample-domain.rsk (click to select)'}</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 20,
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
