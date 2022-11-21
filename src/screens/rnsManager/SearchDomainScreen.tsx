import React, { useState } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { PrimaryButton } from '../../components/button/PrimaryButton'
import { colors } from '../../styles'

import { rnsManagerStyles } from './rnsManagerStyles'

import { MediumText } from '../../components'
import { AvatarIcon } from '../../components/icons/AvatarIcon'
import { ConfirmationModal } from '../../components/modal/ConfirmationModal'
import { RootStackScreenProps } from 'navigation/rootNavigator/types'
import DomainLookUp from '../../screens/rnsManager/DomainLookUp'
import { ScreenWithWallet } from '../types'
import TitleStatus from './TitleStatus'

type Props = {
  route: any
}
export const SearchDomainScreen: React.FC<
  RootStackScreenProps<'SearchDomain'> & ScreenWithWallet & Props
> = ({ wallet, navigation }) => {
  const [domainToLookUp, setDomainToLookUp] = useState<string>('')
  const [validDomain, setValidDomain] = useState<boolean>(false)
  const [selectedYears, setSelectedYears] = useState<number>(2)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<string>('2')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)

  const calculatePrice = async (domain: string, years: number) => {
    //TODO: re enable this later
    /*const price = await rskRegistrar.price(domain, BigNumber.from(years))
    return utils.formatUnits(price, 18)*/
    if (years < 3) {
      return years * 2
    } else {
      return 4 + (years - 2)
    }
  }

  const handleDomainAvailable = async (domain: string, valid: boolean) => {
    setValidDomain(valid)
    if (valid) {
      const price = await calculatePrice(domain, selectedYears)
      setSelectedDomainPrice(price + '')
    }
  }
  const handleYearsChange = async (years: number) => {
    setSelectedYears(years)
    const price = await calculatePrice(domainToLookUp, years)
    setSelectedDomainPrice(price + '')
  }

  return (
    <>
      <View style={rnsManagerStyles.profileHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={rnsManagerStyles.backButton}>
            <MaterialIcon name="west" color={colors.lightPurple} size={10} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={rnsManagerStyles.container}>
        <TitleStatus
          title={'Choose alias'}
          subTitle={'next: Request process'}
          progress={0.25}
          progressText={'1/4'}
        />

        <View style={rnsManagerStyles.marginBottom}>
          <View style={rnsManagerStyles.profileImageContainer}>
            {domainToLookUp.length >= 5 ? (
              <AvatarIcon value={domainToLookUp + '.rsk'} size={80} />
            ) : (
              <Image
                style={rnsManagerStyles.profileImage}
                source={require('../../images/image_place_holder.jpeg')}
              />
            )}
            <View>
              <MediumText style={rnsManagerStyles.profileDisplayAlias}>
                {domainToLookUp !== '' ? domainToLookUp + '.rsk' : 'alias name'}
              </MediumText>
            </View>
          </View>
        </View>

        <View style={rnsManagerStyles.marginBottom}>
          <DomainLookUp
            initialValue={domainToLookUp}
            onChangeText={setDomainToLookUp}
            wallet={wallet}
            onDomainAvailable={handleDomainAvailable}
          />
        </View>
        <View style={styles.flexContainer}>
          <MediumText style={styles.priceText}>
            {`${selectedYears} years ${selectedDomainPrice} rif`}
          </MediumText>
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
          <TouchableOpacity
            onPress={() => handleYearsChange(selectedYears + 1)}
            style={styles.addIcon}>
            <MaterialIcon
              name="add"
              color={colors.background.darkBlue}
              size={20}
            />
          </TouchableOpacity>
        </View>

        <View style={rnsManagerStyles.bottomContainer}>
          <PrimaryButton
            disabled={!validDomain}
            onPress={() =>
              // @ts-ignore
              navigation.navigate('RequestDomain', {
                navigation,
                alias: domainToLookUp.replace('.rsk', ''),
                duration: selectedYears,
              })
            }
            accessibilityLabel="request"
            title={'request'}
          />
        </View>
      </View>
      <ConfirmationModal
        isVisible={isModalVisible}
        title="2 step process"
        description={`Registering a username requires you to make two transactions in RIF. First transaction is requesting the username. Second transaction is the actual purchase of the username.
          \nWe are working hard on improving this experience for you!`}
        okText="Ok, thank you!"
        onOk={() => setIsModalVisible(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  priceText: {
    flex: 1,
    width: '100%',
    color: colors.lightPurple,
    marginLeft: 15,
  },
  minusIcon: {
    backgroundColor: 'gray',
    borderRadius: 20,
    margin: 5,
  },
  addIcon: {
    backgroundColor: 'gray',
    borderRadius: 20,
    margin: 5,
    marginRight: 10,
  },
})
