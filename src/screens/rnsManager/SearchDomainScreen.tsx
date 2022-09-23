import React, { useState } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { colors } from '../../styles'
import { PurpleButton } from '../../components/button/ButtonVariations'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import DomainLookUp from '../../screens/rnsManager/DomainLookUp'
import { MediumText } from '../../components'
import { IProfileStore } from '../../storage/ProfileStore'
import TitleStatus from './TitleStatus'

type Props = {
  profile: IProfileStore
  setProfile: (p: IProfileStore) => void
}

export const SearchDomainScreen: React.FC<
  ScreenProps<'SearchDomain'> & ScreenWithWallet & Props
> = ({ wallet, navigation }) => {
  const [domainToLookUp, setDomainToLookUp] = useState<string>('')

  useState<boolean>(false)
  const [selectedYears, setSelectedYears] = useState<number>(2)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<string>('2')

  const calculatePrice = async (domain: string, years: number) => {
    //TODO: reenable this later
    /*const price = await rskRegistrar.price(domain, BigNumber.from(years))
    return utils.formatUnits(price, 18)*/
    if (years < 3) {
      return years * 2
    } else {
      return 4 + (years - 2)
    }
  }

  const handleDomainAvailable = async (domain: string) => {
    const price = await calculatePrice(domain, selectedYears)
    setSelectedDomainPrice(price + '')
  }
  const handleYearsChange = async (years: number) => {
    setSelectedYears(years)
    const price = await calculatePrice(domainToLookUp, years)
    setSelectedDomainPrice(price + '')
  }

  return (
    <>
      <View style={styles.profileHeader}>
        {/*@ts-ignore*/}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={styles.backButton}>
            <MaterialIcon name="west" color="white" size={10} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TitleStatus title={'Choose alias'} />
        <View style={styles.marginBottom}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={require('../../images/image_place_holder.jpeg')}
            />
            <View>
              <MediumText style={styles.profileDisplayAlias}>
                {domainToLookUp !== '' ? domainToLookUp : 'alias name'}
              </MediumText>
            </View>
          </View>
        </View>

        <View style={styles.marginBottom}>
          <DomainLookUp
            initialValue={domainToLookUp}
            onChangeText={setDomainToLookUp}
            wallet={wallet}
            onDomainAvailable={handleDomainAvailable}
          />
        </View>
        <View style={styles.flexContainer}>
          <View style={styles.priceContainer}>
            <MediumText
              style={
                styles.priceText
              }>{`${selectedYears} years ${selectedDomainPrice} rif`}</MediumText>
          </View>
          <TouchableOpacity
            onPress={() => handleYearsChange(selectedYears + 1)}
            style={styles.addIcon}>
            <MaterialIcon
              name="add"
              color={colors.background.darkBlue}
              size={20}
            />
          </TouchableOpacity>
          {selectedYears > 1 && (
            <TouchableOpacity
              onPress={() => handleYearsChange(selectedYears - 1)}
              style={styles.minusIcon}>
              <MaterialIcon
                name="remove"
                color={colors.background.darkBlue}
                size={20}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <PurpleButton
            onPress={() =>
              // @ts-ignore
              navigation.navigate('RequestDomain', {
                navigation,
                alias: domainToLookUp,
              })
            }
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.background.darkBlue,
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
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  profileDisplayAlias: {
    color: colors.white,
    padding: 10,
  },
  marginBottom: {
    marginBottom: 10,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  flexContainer: {
    flexDirection: 'row',
  },
  priceContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 15,
    width: '100%',
    padding: 15,
  },
  priceText: {
    color: 'white',
  },
  addIcon: {
    right: 60,
    top: 15,
    backgroundColor: 'gray',
    height: 20,
    borderRadius: 20,
  },
  minusIcon: {
    right: 50,
    top: 15,
    backgroundColor: 'gray',
    height: 20,
    borderRadius: 20,
  },
})
