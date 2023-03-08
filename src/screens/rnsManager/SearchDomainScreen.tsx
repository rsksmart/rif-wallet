import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import * as yup from 'yup'

import { AppTouchable } from 'components/appTouchable'
import {
  AppButton,
  AppButtonBackgroundVarietyEnum,
  Input,
  Typography,
} from 'components/index'
import { InfoBox } from 'components/InfoBox'
import { SlidePopupConfirmationInfo } from 'components/slidePopup/SlidePopupConfirmationInfo'
import { headerLeftOption, headerStyles } from 'navigation/profileNavigator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
  ProfileStatus,
} from 'navigation/profileNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { balanceToDisplay, balanceToUSD } from 'src/lib/utils'
import { selectBalances } from 'store/slices/balancesSlice'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { recoverAlias } from 'store/slices/profileSlice'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'

import { ScreenWithWallet } from '../types'
import { DomainInput } from './DomainInput'
import { rnsManagerStyles } from './rnsManagerStyles'

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

  // get RIF token
  const rifToken = useMemo(
    () =>
      Object.values(tokenBalances).find(
        token => token.symbol === 'RIF' || token.symbol === 'tRIF',
      ) || ({} as ITokenWithoutLogo),
    [tokenBalances],
  )

  const rifTokenAddress = rifToken.contractAddress || ''
  const rifTokenPrice = prices[rifTokenAddress]?.price

  const rifTokenBalanceInUsd = balanceToUSD(
    rifToken.balance,
    rifToken.decimals,
    rifTokenPrice,
  )

  const selectedDomainPriceInUsd = (
    selectedDomainPrice * rifTokenPrice
  ).toFixed(2)

  const domainToLookUp = methods.getValues('domain')
  const isRequestButtonDisabled = hasErrors || !validDomain
  const isSaveButtonDisabled = (hasErrors || !validDomain) && !isDomainOwned

  const onSubmit = () => {
    const confirmButton = {
      title: t('Confirm'),
      color: sharedColors.white,
      textColor: sharedColors.black,
      onPress: () => {
        console.log('confirm')
      },
    }
    const cancelButton = {
      title: t('Cancel'),
      color: sharedColors.white,
      textColor: sharedColors.white,
      backgroundVariety: AppButtonBackgroundVarietyEnum.OUTLINED,
      onPress: () => {
        navigation.goBack()
      },
    }
    navigation.navigate(rootTabsRouteNames.TransactionSummary, {
      title: t('request_username_summary_title'),
      transaction: {
        tokenValue: {
          symbol: rifToken.symbol,
          symbolType: 'icon',
          balance: balanceToDisplay(rifToken.balance, rifToken.decimals),
        },
        usdValue: {
          symbol: '',
          symbolType: 'text',
          balance: rifTokenBalanceInUsd,
        },
        receiveValue: `${selectedDomainPrice}`,
        sendValue: `${selectedDomainPrice}`,
        feeValue: '0',
      },
      contact: {
        address: '0x8C7820B97BFDe7140c676227b3e5e814F2E67afB',
        displayAddress: 'RNS Manager',
      },
      buttons: [confirmButton, cancelButton],
    })
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

    navigation.navigate(profileStackRouteNames.ProfileCreateScreen)
  }, [dispatch, domainToLookUp, navigation])

  useEffect(() => {
    calculatePrice(domainToLookUp, selectedYears).then(setSelectedDomainPrice)
  }, [domainToLookUp, selectedYears, calculatePrice])
  const onBackPress = useCallback(() => navigation.goBack(), [navigation])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(onBackPress),
      headerStyle: [
        headerStyles.headerStyle,
        { backgroundColor: sharedColors.secondary },
      ],
    })
  }, [navigation, onBackPress])
  return (
    <>
      <View style={rnsManagerStyles.container}>
        <FormProvider {...methods}>
          <Typography
            type="h2"
            style={[rnsManagerStyles.subtitle, rnsManagerStyles.marginBottom]}>
            {t('request_username_title')}
          </Typography>

          <InfoBox
            avatar={
              domainToLookUp !== '' ? domainToLookUp + '.rsk' : 'alias name'
            }
            title={t('info_box_title_search_domain')}
            description={t('info_box_description_search_domain')}
            buttonText={t('info_box_close_button')}
          />

          <View style={rnsManagerStyles.marginTop}>
            <DomainInput
              wallet={wallet}
              onDomainOwned={setIsDomainOwned}
              onDomainAvailable={handleDomainAvailable}
            />
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
                    <Icon name="minus" size={16} color={sharedColors.white} />
                  </AppTouchable>
                )}
                <AppTouchable
                  width={40}
                  accessibilityLabel="increase"
                  onPress={() => handleYearsChange(selectedYears + 1)}
                  style={styles.icon}>
                  <Icon name="plus" size={16} color={sharedColors.white} />
                </AppTouchable>
              </View>
            }
          />
          <View style={rnsManagerStyles.bottomContainer}>
            {!isDomainOwned && (
              <AppButton
                disabled={isRequestButtonDisabled}
                onPress={handleSubmit(onSubmit)}
                accessibilityLabel={t('request_username_button')}
                title={t('request_username_button')}
                color={
                  !isRequestButtonDisabled
                    ? sharedColors.white
                    : sharedColors.borderColor
                }
                textColor={
                  !isRequestButtonDisabled
                    ? sharedColors.black
                    : sharedColors.labelLight
                }
                disabledStyle={rnsManagerStyles.disabledButton}
              />
            )}
            {isDomainOwned && (
              <AppButton
                disabled={isSaveButtonDisabled}
                onPress={handleSetProfile}
                accessibilityLabel={t('save_username_button')}
                title={t('save_username_button')}
                color={
                  !isSaveButtonDisabled
                    ? sharedColors.white
                    : sharedColors.borderColor
                }
                textColor={
                  !isSaveButtonDisabled
                    ? sharedColors.black
                    : sharedColors.labelLight
                }
                disabledStyle={rnsManagerStyles.disabledButton}
              />
            )}
          </View>
        </FormProvider>
      </View>
      <SlidePopupConfirmationInfo
        isVisible={isModalVisible}
        height={340}
        title={t('request_username_popup_title')}
        description={t('request_username_popup_description')}
        confirmText={t('request_username_popup_confirm')}
        onConfirm={() => setIsModalVisible(false)}
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
