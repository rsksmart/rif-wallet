import React, { useState } from 'react'
import { BigNumber, utils } from 'ethers'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import { colors } from '../../styles'
import { PurpleButton } from '../../components/button/ButtonVariations'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import addresses from './addresses.json'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { DomainLookUp } from '../../components/domain'

export const SearchDomainScreen: React.FC<
  ScreenProps<'SearchDomain'> & ScreenWithWallet
> = ({ wallet, navigation }) => {
  const [domainToLookUp, setDomainToLookUp] = useState<string>('')

  const [selectedDomain, setSelectedDomain] = useState<string | undefined>(
    undefined,
  )
  const [selectedDomainAvailable, setSelectedDomainAvailable] =
    useState<boolean>(false)
  const [selectedYears, setSelectedYears] = useState<number>(3)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<string>('')

  const [error, setError] = useState('')
  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )
  const handleDomainAvailable = async (domain: string) => {
    const price = await rskRegistrar.price(
      domain,
      BigNumber.from(selectedYears),
    )
    setSelectedDomain(domain)
    setSelectedDomainPrice(utils.formatUnits(price, 18))
  }
  const handleYearsChange = async (years: number) => {
    setSelectedYears(years)
    const price = await rskRegistrar.price(
      domainToLookUp,
      BigNumber.from(years),
    )
    setSelectedDomainPrice(utils.formatUnits(price, 18))
  }
  return (
    <>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={styles.backButton}>
            <MaterialIcon name="west" color="white" size={10} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={require('../../images/image_place_holder.jpeg')}
          />
        </View>

        <DomainLookUp
          initialValue={domainToLookUp}
          onChangeText={setDomainToLookUp}
          domainAvailable={selectedDomainAvailable}
          testID={'To.Input'}
          wallet={wallet}
          onDomainAvailable={handleDomainAvailable}
        />
        <View style={styles.rowContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                backgroundColor: colors.background.secondary,
                borderRadius: 15,
                width: '100%',
                padding: 15,
              }}>
              <Text
                style={{
                  color: 'white',
                }}>{`${selectedYears} years ${selectedDomainPrice} rif`}</Text>
            </View>
            {selectedDomain && (
              <TouchableOpacity
                onPress={() => handleYearsChange(selectedYears + 1)}
                style={{
                  right: 60,
                  top: 15,
                  backgroundColor: 'gray',
                  height: 20,
                  borderRadius: 20,
                }}>
                <MaterialIcon
                  name="add"
                  color={colors.background.darkBlue}
                  size={20}
                />
              </TouchableOpacity>
            )}
            {selectedDomain && selectedYears > 1 && (
              <TouchableOpacity
                onPress={() => handleYearsChange(selectedYears - 1)}
                style={{
                  right: 50,
                  top: 15,
                  backgroundColor: 'gray',
                  height: 20,
                  borderRadius: 20,
                }}>
                <MaterialIcon
                  name="remove"
                  color={colors.background.darkBlue}
                  size={20}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!!error && <Text style={styles.red}>{error}</Text>}

        <View style={styles.rowContainer}>
          <PurpleButton
            onPress={() => {}}
            accessibilityLabel="request"
            title={'request'}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.background.darkBlue,
  },
  titleText: {
    color: colors.white,
  },
  backButton: {
    color: colors.white,
    backgroundColor: colors.blue2,
    borderRadius: 20,
    padding: 10,
    bottom: 3,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  input: {
    width: '100%',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderRadius: 15,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    padding: 14,
    paddingRight: 100,
  },
  redBorder: {
    borderColor: colors.red,
  },
  textLeftMargin: {
    marginLeft: 10,
  },
  masterText: {
    marginBottom: 0,
    color: colors.white,
  },
  rowContainer: {
    margin: 5,
  },
  buttonFirstStyle: {
    width: undefined,
    marginHorizontal: undefined,
    marginBottom: 20,
    backgroundColor: colors.blue,
  },
  aliasContainer: {
    backgroundColor: colors.darkPurple5,
    padding: 17,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aliasText: {
    color: colors.white,
  },
  red: {
    color: colors.red,
  },
})
