import { AddrResolver, RSKRegistrar } from '@rsksmart/rns-sdk'
import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TextInput, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { formatUnits } from 'ethers/lib/utils'

import addresses from './addresses.json'

import { Button, RegularText, SemiBoldText } from 'components/index'
import { addDomain } from 'storage/DomainsStore'
import { getTokenColorWithOpacity } from '../home/tokenColor'
import { ScreenWithWallet } from '../types'

import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'

export const RegisterDomainScreen = ({
  wallet,
  route,
  navigation,
}: ProfileStackScreenProps<profileStackRouteNames.RegisterDomain> &
  ScreenWithWallet) => {
  const { selectedDomain, years } = route.params
  const rskRegistrar = useMemo(
    () =>
      new RSKRegistrar(
        addresses.rskOwnerAddress,
        addresses.fifsAddrRegistrarAddress,
        addresses.rifTokenAddress,
        wallet,
      ),
    [wallet],
  )

  const [error, setError] = useState('')

  const [duration, setDuration] = useState(years.toString())
  const [domainPrice, setDomainPrice] = useState<BigNumber>()

  const [commitToRegisterInfo, setCommitToRegisterInfo] = useState('')
  const [domainSecret, setDomainSecret] = useState('')
  const [commitReady, setCommitReady] = useState(false)

  const [registerDomainInfo, setRegisterDomainInfo] = useState('')
  const [registerReady, setRegisterReady] = useState(false)

  const [resolvingAddress, setResolvingAddress] = useState('')

  const addrResolver = new AddrResolver(addresses.rnsRegistryAddress, wallet)

  useEffect(() => {
    setDomainPrice(undefined)
    if (duration) {
      rskRegistrar
        .price(selectedDomain, BigNumber.from(duration))
        .then(price => setDomainPrice(price))
    }
  }, [duration, rskRegistrar, selectedDomain])

  const commitToRegister = async () => {
    try {
      const { makeCommitmentTransaction, secret, canReveal } =
        await rskRegistrar.commitToRegister(
          selectedDomain,
          wallet.smartWallet.address,
        )

      setDomainSecret(secret)
      setCommitToRegisterInfo('Transaction sent. Please wait...')

      await makeCommitmentTransaction.wait()

      setCommitToRegisterInfo(
        'Transaction confirmed. Please wait approximately 2 mins to secure your domain',
      )

      const intervalId = setInterval(async () => {
        const ready = await canReveal()
        if (ready) {
          setCommitToRegisterInfo(
            'Waiting period ended. You can now register your domain',
          )
          setCommitReady(true)
          clearInterval(intervalId)
        }
      }, 5000)
    } catch (e) {
      setError(e.message || '')
    }
  }

  const registerDomain = async (domain: string) => {
    try {
      const durationToRegister = BigNumber.from(duration)

      if (domainPrice) {
        const tx = await rskRegistrar.register(
          domain,
          wallet.smartWallet.address,
          domainSecret,
          durationToRegister,
          domainPrice,
        )

        setRegisterDomainInfo('Transaction sent. Please wait...')

        await tx.wait()

        await addDomain(wallet.smartWalletAddress, `${selectedDomain}.rsk`)

        const address = await addrResolver.addr(`${selectedDomain}.rsk`)
        console.log({ address })
        setResolvingAddress(address)

        setRegisterDomainInfo('Registered!!')
        setRegisterReady(true)
      }
    } catch (e) {
      setError(e.message || '')
    }
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity('TRBTC', 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <View style={styles.sectionCentered}>
          <SemiBoldText style={styles.domainTitle}>
            {selectedDomain}.rsk
          </SemiBoldText>
        </View>
        <View style={styles.sectionLeft}>
          <RegularText>Registration process will require 3 steps:</RegularText>
          <RegularText>
            1. First transaction: request to register the domain
          </RegularText>
          <RegularText>
            2. Secure domain: wait for aprox. 2 minutes to secure your
            registration
          </RegularText>
          <RegularText>
            3. Second transaction: registration! after this tx is confirmed you
            will own your RNS domain
          </RegularText>
        </View>

        {!!error && <RegularText style={styles.red}>{error}</RegularText>}

        <View style={styles.sectionCentered}>
          <RegularText>Year(s)</RegularText>
          <TextInput
            editable={commitToRegisterInfo === ''}
            style={styles.input}
            onChangeText={setDuration}
            value={duration}
            placeholder={''}
          />
          <RegularText>
            Price: {domainPrice ? formatUnits(domainPrice) : '...'}
          </RegularText>
        </View>

        <View style={styles.sectionCentered}>
          <Button
            disabled={!duration || commitToRegisterInfo !== ''}
            onPress={commitToRegister}
            title={'Request to register'}
          />

          <RegularText>{commitToRegisterInfo}</RegularText>
        </View>
        <View style={styles.sectionCentered}>
          <Button
            disabled={!commitReady || registerReady}
            onPress={() => registerDomain(selectedDomain)}
            title={'Register domain'}
          />

          <RegularText>{registerDomainInfo}</RegularText>
        </View>
        {registerReady && (
          <View style={styles.sectionCentered}>
            <RegularText>You now own {selectedDomain}.rsk</RegularText>
            <RegularText>Address: {resolvingAddress}</RegularText>
            <Button
              onPress={() => {
                navigation.navigate(rootTabsRouteNames.Home)
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
    fontSize: 18,
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
