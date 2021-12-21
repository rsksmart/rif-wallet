import React, { useState } from 'react'
import { BigNumber } from 'ethers'
import { StyleSheet, View, TextInput } from 'react-native'

import { ScrollView, Text } from 'react-native'
import addresses from './addresses.json'

import { ScreenWithWallet } from '../types'
import { Button } from '../../components'
import { ScreenProps } from '../../RootNavigation'
import { RSKRegistrar, AddrResolver } from '@rsksmart/rns-sdk'
import { getDomains, saveDomains } from '../../storage/DomainsStore'

export const RegisterDomainScreen: React.FC<
  ScreenProps<'Activity'> & ScreenWithWallet
> = ({ wallet, route, navigation }) => {
  const [commitToRegisterInfo, setCommitToRegisterInfo] = useState('')
  const [registerDomainInfo, setRegisterDomainInfo] = useState('')
  const [domainSecret, setDomainSecret] = useState('')
  const [duration, setDuration] = useState('1')
  const [resolvingAddress, setResolvingAddress] = useState('1')
  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )
  const addrResolver = new AddrResolver(addresses.rnsRegistryAddress, wallet)
  const selectedDomain = route.params ?? ''
  const commitToRegister = async (domain: string) => {
    if (domain) {
      const { makeCommitmentTransaction, secret, canReveal } =
        await rskRegistrar.commitToRegister(domain, wallet.smartWallet.address)
      setDomainSecret(secret)
      setCommitToRegisterInfo('Transaction sent. Please wait...')
      await makeCommitmentTransaction.wait()

      setCommitToRegisterInfo('Almost done. Please wait approximately 2 mins')
      setInterval(async () => {
        const ready = await canReveal()
        if (ready) {
          setCommitToRegisterInfo('Done')
        }
      }, 5000)

      //set timeout
    }
  }
  const registerDomain = async (domain: string) => {
    const durationToRegister = BigNumber.from(duration)
    const price = await rskRegistrar.price(domain, durationToRegister)
    const tx = await rskRegistrar.register(
      domain,
      wallet.smartWallet.address,
      domainSecret,
      durationToRegister,
      price,
    )
    setRegisterDomainInfo('Transaction sent. Please wait...')
    const registrationReceipt = await tx.wait()
    console.log(registrationReceipt)
    setRegisterDomainInfo('Registered')
    const domains = JSON.parse((await getDomains()) || '[]')
    domains.push(`${selectedDomain}.rsk`)
    await saveDomains(JSON.stringify(domains))
    const address = await addrResolver.addr(selectedDomain)
    setResolvingAddress(address)
  }

  return (
    <ScrollView>
      <View style={styles.sectionCentered}>
        <Text style={styles.title}>{selectedDomain}.rsk</Text>
      </View>

      <View style={styles.sectionCentered}>
        <Text>1. Enter years</Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          placeholder={'Years'}
        />
      </View>

      <View style={styles.sectionCentered}>
        <Text>2. Request Domain</Text>

        {commitToRegisterInfo === '' ? (
          <Button
            onPress={() => commitToRegister(selectedDomain)}
            title={'Request to register'}
          />
        ) : null}
        <Text>{commitToRegisterInfo}</Text>
      </View>
      <View style={styles.sectionCentered}>
        <Text>3. Register Domain</Text>
        {commitToRegisterInfo === 'Done' && registerDomainInfo === '' ? (
          <Button
            onPress={() => registerDomain(selectedDomain)}
            title={'Register domain'}
          />
        ) : null}
        <Text>{registerDomainInfo}</Text>
      </View>
      {registerDomainInfo === 'Registered' ? (
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
      ) : null}
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
})
