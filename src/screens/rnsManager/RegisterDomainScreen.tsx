import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { StyleSheet, View, TextInput } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { Text } from 'react-native'
import addresses from './addresses.json'

import { ScreenWithWallet } from '../types'
import { Button } from '../../components'
import { ScreenProps } from '../../RootNavigation'
import { RSKRegistrar, AddrResolver } from '@rsksmart/rns-sdk'
import { addDomain } from '../../storage/DomainsStore'
import { getTokenColorWithOpacity } from '../home/tokenColor'
import { formatUnits } from 'ethers/lib/utils'
import { ScrollView } from 'react-native-gesture-handler'

export const RegisterDomainScreen: React.FC<
  ScreenProps<'RegisterDomain'> & ScreenWithWallet
> = ({ wallet, route, navigation }) => {
  const { selectedDomain, years } = route.params

  const [error, setError] = useState('')

  const [duration, setDuration] = useState(years.toString())
  const [domainPrice, setDomainPrice] = useState<BigNumber>()

  const [commitToRegisterInfo, setCommitToRegisterInfo] = useState('')
  const [domainSecret, setDomainSecret] = useState('')
  const [commitReady, setCommitReady] = useState(false)

  const [registerDomainInfo, setRegisterDomainInfo] = useState('')
  const [registerReady, setRegisterReady] = useState(false)

  const [resolvingAddress, setResolvingAddress] = useState('')

  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )
  const addrResolver = new AddrResolver(addresses.rnsRegistryAddress, wallet)

  useEffect(() => {
    setDomainPrice(undefined)
    if (!!duration) {
      rskRegistrar.price(selectedDomain, BigNumber.from(duration)).then(price => setDomainPrice(price))
    }
  }, [duration])

  const commitToRegister = async () => {
    try {
      const { makeCommitmentTransaction, secret, canReveal } =
        await rskRegistrar.commitToRegister(selectedDomain, wallet.smartWallet.address)

      setDomainSecret(secret)
      setCommitToRegisterInfo('Transaction sent. Please wait...')

      await makeCommitmentTransaction.wait()

      setCommitToRegisterInfo('Transaction confirmed. Please wait approximately 2 mins to secure your domain')

      const intervalId = setInterval(async () => {
        const ready = await canReveal()
        if (ready) {
          setCommitToRegisterInfo('Waiting period ended. You can now register your domain')
          setCommitReady(true)
          clearInterval(intervalId)
        }
      }, 5000)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const registerDomain = async (domain: string) => {
    try {
      const durationToRegister = BigNumber.from(duration)

      const tx = await rskRegistrar.register(
        domain,
        wallet.smartWallet.address,
        domainSecret,
        durationToRegister,
        domainPrice!,
      )

      setRegisterDomainInfo('Transaction sent. Please wait...')

      await tx.wait()

      await addDomain(wallet.smartWalletAddress, `${selectedDomain}.rsk`)

      const address = await addrResolver.addr(`${selectedDomain}.rsk`)
      console.log({ address })
      setResolvingAddress(address)

      setRegisterDomainInfo('Registered!!')
      setRegisterReady(true)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity('TRBTC', 0.1)]}
      style={styles.parent}>
        <ScrollView>
        <View style={styles.sectionCentered}>
          <Text style={styles.domainTitle}>{selectedDomain}.rsk</Text>
        </View>
        <View style={styles.sectionLeft}>
          <Text>Registration process will require 3 steps:</Text>
          <Text>1. First transaction: request to register the domain</Text>
          <Text>2. Secure domain: wait for aprox. 2 minutes to secure your registration</Text>
          <Text>3. Second transaction: registration! after this tx is confirmed you will own your RNS domain</Text>
        </View>

        {!!error && <Text style={styles.red}>{error}</Text>}

        <View style={styles.sectionCentered}>
          <Text>Year(s)</Text>
          <TextInput
            editable={commitToRegisterInfo === ''}
            style={styles.input}
            onChangeText={setDuration}
            value={duration}
            placeholder={''}
          />
          <Text>Price: {domainPrice ? formatUnits(domainPrice) : '...'}</Text>
        </View>

        <View style={styles.sectionCentered}>
          <Button
            disabled={!duration ||commitToRegisterInfo !== ''}
            onPress={commitToRegister}
            title={'Request to register'}
          />

          <Text>{commitToRegisterInfo}</Text>
        </View>
        <View style={styles.sectionCentered}>
          <Button
            disabled={!commitReady || registerReady}
            onPress={() => registerDomain(selectedDomain)}
            title={'Register domain'}
          />

          <Text>{registerDomainInfo}</Text>
        </View>
        {registerReady && (
          <View style={styles.sectionCentered}>
            <Text>You now own {selectedDomain}.rsk</Text>
            <Text>Address: {resolvingAddress}</Text>
            <Button
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Home')
              }}
              title={'Home'}
            />
          </View>
        )}
        </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    paddingTop: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    height: 50,
    width: 40,
    marginTop: 10,
    margin: 10,
    textAlign: 'center',
  },
  sectionCentered: {
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
  },
  domainTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  sectionLeft: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  red: {
    color: 'red',
  },
})
