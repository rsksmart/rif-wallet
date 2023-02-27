import { useCallback, useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { AppTouchable } from 'components/appTouchable'
import { PrimaryButton } from 'components/button/PrimaryButton'
import { Input } from 'components/index'
import { InfoBox } from 'components/InfoBox'

import { MediumText } from 'components/index'
import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
  ProfileStatus,
} from 'navigation/profileNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import { ScreenWithWallet } from '../types'
import { BackButton } from './BackButton'
import { rnsManagerStyles } from './rnsManagerStyles'

import { castStyle } from 'shared/utils'
import { colors } from 'src/styles'
import { selectBalances } from 'store/slices/balancesSlice'
import { recoverAlias } from 'store/slices/profileSlice'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { DomainInput } from './DomainInput'

type Props = ProfileStackScreenProps<profileStackRouteNames.SearchDomain> &
  ScreenWithWallet

const schema = yup.object({
  domain: yup
    .string()
    .required()
    .matches(/^[a-z0-9]+$/, 'Only lower cases and numbers are allowed')
    .min(5, ''),
})

export const SearchDomainScreen = ({ wallet, navigation }: Props) => {
  const [isDomainOwned, setIsDomainOwned] = useState<boolean>(false)
  const [validDomain, setValidDomain] = useState<boolean>(false)
  const [selectedYears, setSelectedYears] = useState<number>(2)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<number>(2)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)
  const { t } = useTranslation()
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const {
    handleSubmit,
    formState: { errors },
  } = methods
  const hasErrors = Object.keys(errors).length > 0

  // calculate price of domain in USD
  const rifToken = Object.values(tokenBalances).find(
    token => token.symbol === 'RIF' || token.symbol === 'tRIF',
  )
  const rifTokenAddress = rifToken?.contractAddress || ''
  const rifTokenPrice = prices[rifTokenAddress]?.price
  const selectedDomainPriceInUsd = (
    rifTokenPrice * selectedDomainPrice
  ).toFixed(2)

  const domainToLookUp = methods.getValues('domain')

  const onSubmit = (data: FieldValues) => {
    console.log({
      alias: data.domain,
      duration: selectedYears,
    })
    // () =>
    // navigation.navigate(profileStackRouteNames.RequestDomain, {
    //   alias: domainToLookUp.replace('.rsk', ''),
    //   duration: selectedYears,
    // })
  }

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
    [calculatePrice, domainToLookUp, setSelectedYears],
  )

  const handleSetProfile = useCallback(() => {
    dispatch(
      recoverAlias({
        alias: domainToLookUp + '.rsk',
        status: ProfileStatus.USER,
      }),
    )

    navigation.navigate(profileStackRouteNames.ProfileDetailsScreen)
  }, [dispatch, domainToLookUp, navigation])

  useEffect(() => {
    calculatePrice(domainToLookUp, selectedYears).then(setSelectedDomainPrice)
  }, [domainToLookUp, selectedYears, calculatePrice])

  return (
    <>
      <View style={rnsManagerStyles.profileHeader}>
        <BackButton
          onPress={() => navigation.navigate(rootTabsRouteNames.Home)}
          accessibilityLabel="home"
        />
        <MediumText style={rnsManagerStyles.title}>
          {t('username_registration_title')}
        </MediumText>
        <View />
      </View>
      <View style={rnsManagerStyles.container}>
        <FormProvider {...methods}>
          <MediumText
            style={[rnsManagerStyles.subtitle, rnsManagerStyles.marginBottom]}>
            {t('request_username_title')}
          </MediumText>

          <InfoBox
            avatar={
              domainToLookUp !== '' ? domainToLookUp + '.rsk' : 'alias name'
            }
            title={t('info_box_title_search_domain')}
            description={t('info_box_description_search_domain')}
            buttonText={t('info_box_close_button')}
          />

          <View style={rnsManagerStyles.marginTop}>
            <DomainInput wallet={wallet} />
            {/* <DomainLookUp
              initialValue={domainToLookUp}
              onChangeText={setDomainToLookUp}
              wallet={wallet}
              onDomainAvailable={handleDomainAvailable}
              onDomainOwned={setIsDomainOwned}
            /> */}
          </View>
          <Input
            inputName="duration"
            isReadOnly={true}
            label={t('request_username_label')}
            placeholder={`${selectedYears} ${t(
              'request_username_placeholder',
            )}${selectedYears > 1 ? 's' : ''}`}
            subtitle={`${selectedDomainPrice} RIF ($ ${selectedDomainPriceInUsd})`}
            containerStyle={styles.yearsContainer}
            inputStyle={styles.yearsInput}
            rightIcon={
              <View style={styles.yearsButtons}>
                {selectedYears > 1 && (
                  <AppTouchable
                    width={40}
                    accessibilityLabel="decrease"
                    onPress={() => handleYearsChange(selectedYears - 1)}
                    style={styles.icon}>
                    <Icon name="minus" size={16} color={colors.white} />
                  </AppTouchable>
                )}
                <AppTouchable
                  width={40}
                  accessibilityLabel="increase"
                  onPress={() => handleYearsChange(selectedYears + 1)}
                  style={styles.icon}>
                  <Icon name="plus" size={16} color={colors.white} />
                </AppTouchable>
              </View>
            }
          />
          <View style={rnsManagerStyles.bottomContainer}>
            {!isDomainOwned && (
              <PrimaryButton
                disabled={hasErrors}
                onPress={handleSubmit(onSubmit)}
                accessibilityLabel="request"
                title={'request'}
              />
            )}
            {isDomainOwned && (
              <PrimaryButton
                disabled={hasErrors}
                onPress={handleSetProfile}
                accessibilityLabel="set alias"
                title={'set alias'}
              />
            )}
          </View>
        </FormProvider>
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
  yearsInput: castStyle.text({
    paddingLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  yearsButtons: castStyle.view({
    flexDirection: 'row',
  }),
  icon: castStyle.view({
    alignSelf: 'center',
    padding: 10,
  }),
})
