import React, { useState } from 'react'
import { BigNumber } from 'ethers'
import { StyleSheet, View, TextInput } from 'react-native'

import { ScrollView, Text } from 'react-native'

import { ScreenWithWallet } from '../types'
import { Button } from '../../components'
import { ScreenProps } from '../../RootNavigation'
import { RSKRegistrar, AddrResolver } from '../../lib/rns-rsk'
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
    '0xca0a477e19bac7e0e172ccfd2e3c28a7200bdb71',
    '0x90734bd6bf96250a7b262e2bc34284b0d47c1e8d',
    '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    wallet,
  )
  const addrResolver = new AddrResolver(
    '0x7d284aaac6e925aad802a53c0c69efe3764597b8',
    wallet,
  )
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
