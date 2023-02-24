import { useState, useCallback } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { colors } from 'src/styles'
import { PrimaryButton } from 'components/button/PrimaryButton'
import { MediumText } from 'components/index'
import { InfoBox } from 'components/InfoBox'

import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
  ProfileStatus,
} from 'navigation/profileNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import DomainLookUp from 'screens/rnsManager/DomainLookUp'
import { rnsManagerStyles } from './rnsManagerStyles'
import { ScreenWithWallet } from '../types'
import TitleStatus from './TitleStatus'

import { useAppDispatch } from 'store/storeUtils'
import { recoverAlias } from 'store/slices/profileSlice'

type Props = ProfileStackScreenProps<profileStackRouteNames.SearchDomain> &
  ScreenWithWallet

export const SearchDomainScreen = ({ wallet, navigation }: Props) => {
  const [domainToLookUp, setDomainToLookUp] = useState<string>('')
  const [isDomainOwned, setIsDomainOwned] = useState<boolean>(false)
  const [validDomain, setValidDomain] = useState<boolean>(false)
  const [selectedYears, setSelectedYears] = useState<number>(2)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<string>('2')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const dispatch = useAppDispatch()

  const calculatePrice = async (_: string, years: number) => {
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

  const handleSetProfile = useCallback(() => {
    dispatch(
      recoverAlias({
        alias: domainToLookUp + '.rsk',
        status: ProfileStatus.USER,
      }),
    )

    navigation.navigate(profileStackRouteNames.ProfileDetailsScreen)
  }, [dispatch, domainToLookUp, navigation])

  const { t } = useTranslation()

  return (
    <>
      <View style={rnsManagerStyles.profileHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate(rootTabsRouteNames.Home)}
          accessibilityLabel="home">
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

        <InfoBox
          avatar={
            domainToLookUp !== '' ? domainToLookUp + '.rsk' : 'alias name'
          }
          title={t('info_box_title_search_domain')}
          description={t('info_box_description_search_domain')}
          buttonText={t('info_box_close_button')}
        />

        <View style={rnsManagerStyles.marginBottom}>
          <DomainLookUp
            initialValue={domainToLookUp}
            onChangeText={setDomainToLookUp}
            wallet={wallet}
            onDomainAvailable={handleDomainAvailable}
            onDomainOwned={setIsDomainOwned}
          />
        </View>
        <View style={styles.flexContainer}>
          <MediumText style={styles.priceText}>
            {`${selectedYears} years ${selectedDomainPrice} rif`}
          </MediumText>
          {selectedYears > 1 && (
            <TouchableOpacity
              accessibilityLabel="decreases"
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
            accessibilityLabel="increase"
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
          {!isDomainOwned && (
            <PrimaryButton
              disabled={!validDomain}
              onPress={() =>
                navigation.navigate(profileStackRouteNames.RequestDomain, {
                  alias: domainToLookUp.replace('.rsk', ''),
                  duration: selectedYears,
                })
              }
              accessibilityLabel="request"
              title={'request'}
            />
          )}
          {isDomainOwned && (
            <PrimaryButton
              disabled={!validDomain}
              onPress={handleSetProfile}
              accessibilityLabel="set alias"
              title={'set alias'}
            />
          )}
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
