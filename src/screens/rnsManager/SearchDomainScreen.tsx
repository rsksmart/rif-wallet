import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import * as yup from 'yup'

import {
  RnsProcessor,
  useRifToken,
  useRnsDomainPriceInRif as calculatePrice,
} from 'lib/rns'

import { AppTouchable } from 'components/appTouchable'
import { AppButton, Input, Typography } from 'components/index'
import { SlidePopupConfirmationInfo } from 'components/slidePopup/SlidePopupConfirmationInfo'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
  ProfileStatus,
} from 'navigation/profileNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { colors } from 'src/styles'
import {
  recoverAlias,
  requestUsername,
  selectProfileStatus,
} from 'store/slices/profileSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { AvatarIconBox } from 'screens/rnsManager/AvatarIconBox'
import { AppSpinner } from 'components/index'
import { rootTabsRouteNames } from 'src/navigation/rootNavigator'
import { settingsStackRouteNames } from 'src/navigation/settingsNavigator/types'

import { ScreenWithWallet } from '../types'
import { DomainInput } from './DomainInput'
import { rnsManagerStyles } from './rnsManagerStyles'

type Props = ProfileStackScreenProps<profileStackRouteNames.SearchDomain> &
  ScreenWithWallet

interface FormValues {
  domain: string
  years: number
}

const schema = yup.object<FormValues>({
  domain: yup
    .string()
    .required()
    .min(3, '')
    .matches(/^[a-z0-9]+$/, 'Only lower cases and numbers are allowed'),
  years: yup.number().required(),
})

export const SearchDomainScreen = ({
  wallet,
  navigation,
  walletDeployed,
}: Props) => {
  const { isDeployed, loading } = walletDeployed
  const [isDomainOwned, setIsDomainOwned] = useState<boolean>(false)
  const [validDomain, setValidDomain] = useState<boolean>(false)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<number>(2)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [currentStatus, setCurrentStatus] = useState<string>('')
  const profileStatus = useAppSelector(selectProfileStatus)

  const dispatch = useAppDispatch()
  const rifToken = useRifToken()

  const { t } = useTranslation()
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      domain: '',
      years: 2,
    },
    resolver: yupResolver(schema),
  })

  const {
    handleSubmit,
    resetField,
    watch,
    setValue,
    formState: { errors },
  } = methods

  const domain = watch('domain')
  const years = watch('years')
  const hasErrors = Object.keys(errors).length > 0

  const selectedDomainPriceInUsd = (
    rifToken.price * selectedDomainPrice
  ).toFixed(2)

  const isRequestButtonDisabled = hasErrors || !validDomain
  const isSaveButtonDisabled = (hasErrors || !validDomain) && !isDomainOwned

  const rnsProcessor = useMemo(() => new RnsProcessor({ wallet }), [wallet])

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setError('')
      setCurrentStatus('')
      try {
        setCurrentStatus('loading')
        await dispatch(
          requestUsername({
            rnsProcessor,
            alias: values.domain,
            duration: values.years,
          }),
        ).unwrap()
        navigation.navigate(profileStackRouteNames.PurchaseDomain)
      } catch (requestUsernameError) {
        if (
          requestUsernameError instanceof Error ||
          typeof requestUsernameError === 'string'
        ) {
          const message = requestUsernameError.toString()
          if (message.includes('Transaction rejected')) {
            setError(t('search_domain_error_request_rejected'))
          } else if (message.includes('balance too low')) {
            setError(t('search_domain_error_funds_low'))
          } else {
            setError(t('search_domain_random_error'))
          }
        }
      } finally {
        setCurrentStatus('')
      }
    },
    [dispatch, rnsProcessor, t, navigation],
  )

  const handleDomainAvailable = useCallback(
    async (domainString: string, valid: boolean) => {
      setValidDomain(valid)
      if (valid) {
        const price = await calculatePrice(domainString, years)
        setSelectedDomainPrice(price)
      }
    },
    [years],
  )

  const handleYearsChange = useCallback(
    async (changedYears: number) => {
      setValue('years', changedYears)
      const price = await calculatePrice(domain, changedYears)
      setSelectedDomainPrice(price)
    },
    [domain, setValue],
  )

  const handleSetProfile = useCallback(() => {
    dispatch(
      recoverAlias({
        alias: domain + '.rsk',
        status: ProfileStatus.USER,
      }),
    )

    navigation.navigate(profileStackRouteNames.ProfileCreateScreen)
  }, [dispatch, domain, navigation])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])

  useEffect(() => {
    calculatePrice(domain, years).then(setSelectedDomainPrice)
  }, [domain, years])

  useEffect(() => {
    if (!isDeployed && !loading) {
      navigation.goBack()
      navigation.navigate(rootTabsRouteNames.Settings, {
        screen: settingsStackRouteNames.RelayDeployScreen,
        params: {
          goBackScreen: {
            parent: rootTabsRouteNames.Profile,
            child: profileStackRouteNames.ProfileCreateScreen,
          },
        },
      })
    }
  }, [isDeployed, loading, navigation])

  useEffect(() => {
    if (loading) {
      Alert.alert(
        t('wallet_deploy_deploying_alert_title'),
        t('wallet_deploy_deploying_alert_body'),
        [{ onPress: navigation.goBack, text: t('ok') }],
      )
    }
  }, [loading, t, navigation])

  return (
    <ScrollView
      style={rnsManagerStyles.scrollContainer}
      automaticallyAdjustContentInsets
      // it exists for ios but shows error https://reactnative.dev/docs/scrollview#automaticallyadjustkeyboardinsets-ios
      automaticallyAdjustKeyboardInsets>
      <View style={rnsManagerStyles.container}>
        <Typography
          type="h2"
          style={[rnsManagerStyles.subtitle, rnsManagerStyles.marginBottom]}>
          {t('request_username_title')}
        </Typography>
        <AvatarIconBox text={(domain || '') + '.rsk'} />
        <FormProvider {...methods}>
          <View style={rnsManagerStyles.marginTop}>
            <DomainInput
              wallet={wallet}
              inputName={'domain'}
              error={errors.domain}
              onDomainOwned={setIsDomainOwned}
              onDomainAvailable={handleDomainAvailable}
              onResetValue={() => {
                resetField('domain')
              }}
            />
          </View>
          <Input
            inputName={'years'}
            isReadOnly
            label={t('request_username_label')}
            placeholder={`${years} ${t('request_username_placeholder')}${
              years > 1 ? 's' : ''
            }`}
            subtitle={`${selectedDomainPrice} ${rifToken.symbol} ($ ${selectedDomainPriceInUsd})`}
            containerStyle={styles.yearsContainer}
            rightIcon={
              <View style={styles.yearsButtons}>
                {years > 1 && (
                  <AppTouchable
                    width={40}
                    accessibilityLabel="decrease"
                    onPress={() => handleYearsChange(years - 1)}>
                    <Icon name="minus" size={16} color={colors.white} />
                  </AppTouchable>
                )}
                <AppTouchable
                  width={40}
                  accessibilityLabel="increase"
                  onPress={() => handleYearsChange(years + 1)}>
                  <Icon name="plus" size={16} color={colors.white} />
                </AppTouchable>
              </View>
            }
          />
          {error !== '' && (
            <Typography type="body1" style={styles.errorTypography}>
              {error}
            </Typography>
          )}
          {(profileStatus === ProfileStatus.REQUESTING ||
            currentStatus === 'loading') && (
            <>
              <View style={[sharedStyles.contentCenter]}>
                <AppSpinner size={64} thickness={10} />
              </View>
              <Typography type="body1">
                {t('search_domain_processing_commitment')}
              </Typography>
            </>
          )}
        </FormProvider>
        {!isDomainOwned ? (
          <AppButton
            style={rnsManagerStyles.button}
            disabled={
              isRequestButtonDisabled ||
              currentStatus === 'loading' ||
              profileStatus === ProfileStatus.REQUESTING
            }
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
        ) : (
          <AppButton
            style={rnsManagerStyles.button}
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

      <SlidePopupConfirmationInfo
        isVisible={isModalVisible && isDeployed}
        height={350}
        title={t('request_username_popup_title')}
        description={t('request_username_popup_description')}
        confirmText={t('request_username_popup_confirm')}
        onConfirm={() => setIsModalVisible(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  yearsContainer: castStyle.view({
    height: 90,
    paddingRight: 10,
  }),
  yearsButtons: castStyle.view({
    flexDirection: 'row',
  }),
  errorTypography: castStyle.text({
    paddingHorizontal: 5,
    marginTop: 10,
  }),
})
