import { useState, useCallback, useEffect } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import Icon from 'react-native-vector-icons/AntDesign'

import { PrimaryButton } from 'components/button/PrimaryButton'
import { Input, MediumText } from 'components/index'
import { AvatarIcon } from 'components/icons/AvatarIcon'
import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import DomainLookUp from 'screens/rnsManager/DomainLookUp'
import { rnsManagerStyles } from './rnsManagerStyles'
import { ScreenWithWallet } from '../types'
import TitleStatus from './TitleStatus'

import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { setProfile } from 'store/slices/profileSlice'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { selectBalances } from 'src/redux/slices/balancesSlice/selectors'
import { selectUsdPrices } from 'src/redux/slices/usdPricesSlice'
import { colors } from 'src/styles'
import { castStyle } from 'shared/utils'

type Props = ProfileStackScreenProps<profileStackRouteNames.SearchDomain> &
  ScreenWithWallet

export const SearchDomainScreen = ({ wallet, navigation }: Props) => {
  const [domainToLookUp, setDomainToLookUp] = useState<string>('')
  const [isDomainOwned, setIsDomainOwned] = useState<boolean>(false)
  const [validDomain, setValidDomain] = useState<boolean>(false)
  const [selectedYears, setSelectedYears] = useState<number>(2)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<number>(2)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)
  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)
  const methods = useForm()

  // calculate price of domain in USD
  const rifToken = Object.values(tokenBalances).find(
    t => t.symbol === 'RIF' || t.symbol === 'tRIF',
  )
  const rifTokenAddress = rifToken?.contractAddress || ''
  const rifTokenPrice = prices[rifTokenAddress]?.price
  const selectedDomainPriceInUsd = (
    rifTokenPrice * selectedDomainPrice
  ).toFixed(2)

  const calculatePrice = useCallback(async (_: string, years: number) => {
    //TODO: re enable this later
    /*const price = await rskRegistrar.price(domain, BigNumber.from(years))
    return utils.formatUnits(price, 18)*/
    if (years < 3) {
      return years * 2
    } else {
      return 4 + (years - 2)
    }
  }, [])

  const handleDomainAvailable = useCallback(
    async (domain: string, valid: boolean) => {
      setValidDomain(valid)
      if (valid) {
        const price = await calculatePrice(domain, selectedYears)
        setSelectedDomainPrice(price)
      }
    },
    [calculatePrice, selectedYears],
  )

  const handleYearsChange = useCallback(
    async (years: number) => {
      setSelectedYears(years)
      const price = await calculatePrice(domainToLookUp, years)
      setSelectedDomainPrice(price)
    },
    [calculatePrice, domainToLookUp],
  )

  const handleSetProfile = useCallback(() => {
    dispatch(
      setProfile({
        ...(profile ? profile : { phone: '', email: '' }),
        alias: domainToLookUp + '.rsk',
      }),
    )

    navigation.navigate(profileStackRouteNames.ProfileDetailsScreen)
  }, [dispatch, domainToLookUp, profile, navigation])

  useEffect(() => {
    calculatePrice(domainToLookUp, selectedYears).then(setSelectedDomainPrice)
  }, [domainToLookUp, selectedYears, calculatePrice])

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
            onDomainOwned={setIsDomainOwned}
          />
        </View>
        <FormProvider {...methods}>
          <Input
            inputName="years"
            value={selectedYears + ''}
            isReadOnly={true}
            label="Length of registration"
            placeholder={`${selectedYears} years`}
            subtitle={`${selectedDomainPrice} RIF ($ ${selectedDomainPriceInUsd})`}
            containerStyle={styles.yearsContainer}
            subtitleStyle={styles.yearsSubtitle}
            rightIcon={
              <View style={styles.yearsButtons}>
                {selectedYears > 1 && (
                  <TouchableOpacity
                    accessibilityLabel="decrease"
                    onPress={() => handleYearsChange(selectedYears - 1)}
                    style={styles.icon}>
                    <Icon name="minus" size={16} color={colors.white} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  accessibilityLabel="increase"
                  onPress={() => handleYearsChange(selectedYears + 1)}
                  style={styles.icon}>
                  <Icon name="plus" size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            }
          />
        </FormProvider>
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
  yearsContainer: castStyle.view({
    height: 90,
    paddingRight: 10,
  }),
  yearsSubtitle: castStyle.view({
    marginTop: 12,
  }),
  yearsButtons: castStyle.view({
    flexDirection: 'row',
  }),
  priceText: castStyle.text({
    flex: 1,
    width: '100%',
    color: colors.lightPurple,
    marginLeft: 15,
  }),
  icon: castStyle.view({
    alignSelf: 'center',
    padding: 10,
  }),
})
