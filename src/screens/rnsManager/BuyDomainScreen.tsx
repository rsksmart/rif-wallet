import React, { useState, useEffect } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { BigNumber, utils } from 'ethers'
import { RSKRegistrar, AddrResolver } from '@rsksmart/rns-sdk'

import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { colors } from '../../styles'
import { rnsManagerStyles } from './rnsManagerStyles'

import { PurpleButton } from '../../components/button/ButtonVariations'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import { MediumText } from '../../components'
import { IProfileStore } from '../../storage/ProfileStore'
import addresses from './addresses.json'
import TitleStatus from './TitleStatus'
import { addDomain } from '../../storage/DomainsStore'

type Props = {
  profile: IProfileStore
  setProfile: (p: IProfileStore) => void
  route: any
}

export const BuyDomainScreen: React.FC<
  ScreenProps<'BuyDomain'> & ScreenWithWallet & Props
> = ({ wallet, profile, setProfile, navigation, route }) => {
  const { alias, domainSecret, duration } = route.params

  const [registerDomainInfo, setRegisterDomainInfo] = useState('')
  const [registerReady, setRegisterReady] = useState(false)
  const [registerInProcess, setRegisterInProcess] = useState(false)
  const [domainPrice, setDomainPrice] = useState<BigNumber>()

  const [setResolvingAddress] = useState('')

  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )
  const addrResolver = new AddrResolver(addresses.rnsRegistryAddress, wallet)

  useEffect(() => {
    setDomainPrice(undefined)
    if (duration) {
      rskRegistrar
        .price(alias, BigNumber.from(duration))
        .then(price => setDomainPrice(price))
    }
  }, [])
  const registerDomain = async (domain: string) => {
    try {
      const durationToRegister = BigNumber.from(2)

      const tx = await rskRegistrar.register(
        domain,
        wallet.smartWallet.address,
        domainSecret,
        durationToRegister,
        domainPrice!,
      )

      setRegisterDomainInfo('Transaction sent. Please wait...')
      setRegisterInProcess(true)
      await tx.wait()

      await addDomain(wallet.smartWalletAddress, `${alias}.rsk`)

      const address = await addrResolver.addr(`${alias}.rsk`)
      setResolvingAddress(address)

      setRegisterDomainInfo('Registered!!')
      setRegisterReady(true)
      // @ts-ignore
    } catch (e: any) {
      setRegisterInProcess(false)
      setRegisterDomainInfo(e.message)
    }
  }
  const selectDomain = async (domain: string) => {
    await setProfile({
      ...profile,
      alias: domain,
    } as unknown as IProfileStore)

    // @ts-ignore
    navigation.navigate('ProfileCreateScreen', {
      navigation,
      profile: { alias: alias },
    })
  }
  return (
    <>
      <View style={rnsManagerStyles.profileHeader}>
        {/*@ts-ignore*/}
        <TouchableOpacity onPress={() => navigation.navigate('SearchDomain')}>
          <View style={rnsManagerStyles.backButton}>
            <MaterialIcon name="west" color="white" size={10} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={rnsManagerStyles.container}>
        <TitleStatus
          title={'Buy alias'}
          subTitle={'next: Confirm'}
          progress={0.66}
          progressText={'3/4'}
        />
        <View style={rnsManagerStyles.marginBottom}>
          {domainPrice && (
            <>
              <MediumText style={styles.priceLabel}>
                {utils.formatUnits(domainPrice, 18)} RIF
              </MediumText>
              <MediumText style={styles.priceLabel}>
                {duration} years
              </MediumText>
            </>
          )}
          <View style={rnsManagerStyles.profileImageContainer}>
            <Image
              style={rnsManagerStyles.profileImage}
              source={require('../../images/image_place_holder.jpeg')}
            />
            <View>
              <MediumText style={rnsManagerStyles.profileDisplayAlias}>
                {alias}.rsk
              </MediumText>
            </View>
          </View>
        </View>

        <MediumText style={rnsManagerStyles.profileDisplayAlias}>
          {registerDomainInfo}
        </MediumText>

        <View style={rnsManagerStyles.bottomContainer}>
          {!registerInProcess && (
            <PurpleButton
              onPress={() => registerDomain(alias)}
              accessibilityLabel="buy"
              title={'buy'}
            />
          )}
          {registerReady && (
            <PurpleButton
              onPress={() => selectDomain(alias + '.rsk')}
              accessibilityLabel="Set alias in profile"
              title={'Set alias in profile'}
            />
          )}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  priceLabel: {
    color: colors.white,
    alignSelf: 'center',
    fontSize: 25,
  },
})
