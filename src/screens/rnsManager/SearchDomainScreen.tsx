import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import * as yup from 'yup'
import { showMessage } from 'react-native-flash-message'

import { useRifToken, calculateRnsDomainPrice } from 'lib/rns'

import { AppTouchable } from 'components/appTouchable'
import { AppButton, Input, Typography } from 'components/index'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
  ProfileStatus,
} from 'navigation/profileNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle, formatTokenValue } from 'shared/utils'
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
import { ConfirmationModal } from 'components/modal'
import { useGetRnsProcessor, useWallet } from 'shared/wallet'
import { getPopupMessage } from 'shared/popupMessage'

import { DomainInput } from './DomainInput'
import { rnsManagerStyles } from './rnsManagerStyles'

export const minDomainLength = 5

type Props = ProfileStackScreenProps<profileStackRouteNames.SearchDomain>

interface FormValues {
  domain: string
  years: number
}

export const SearchDomainScreen = ({ navigation }: Props) => {
  const getRnsProcessor = useGetRnsProcessor()
  const rnsProcessor = getRnsProcessor()
  const { walletIsDeployed, address } = useWallet()
  const { isDeployed, loading } = walletIsDeployed

  const [isDomainOwned, setIsDomainOwned] = useState<boolean>(false)
  const [validDomain, setValidDomain] = useState<boolean>(false)
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<string>('2')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [currentStatus, setCurrentStatus] = useState<string>('')
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false)

  const profileStatus = useAppSelector(selectProfileStatus)

  const dispatch = useAppDispatch()
  const rifToken = useRifToken()

  const { t } = useTranslation()
  const schema = useMemo(
    () =>
      yup.object<FormValues>({
        domain: yup
          .string()
          .required()
          .min(minDomainLength, t('search_domain_min_error'))
          .matches(/^[a-z0-9]+$/, t('search_domain_lowercase_error')),
        years: yup.number().required(),
      }),
    [t],
  )
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

  const selectedDomainPriceInUsd = formatTokenValue(
    rifToken.price * Number(selectedDomainPrice),
  )

  const isRequestButtonDisabled = hasErrors || !validDomain
  const isSaveButtonDisabled = isRequestButtonDisabled && !isDomainOwned

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setError('')
      setCurrentStatus('')
      try {
        setCurrentStatus('loading')
        await dispatch(
          requestUsername({
            getRnsProcessor,
            alias: values.domain,
            duration: values.years,
          }),
        ).unwrap()
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
    [dispatch, t, getRnsProcessor],
  )

  const handleDomainAvailable = useCallback(
    async (domainString: string, valid: boolean) => {
      try {
        const rskRegistrar = getRnsProcessor()?.rskRegistrar

        setValidDomain(valid)
        if (valid && rskRegistrar) {
          setIsCalculatingPrice(true)
          const price = await calculateRnsDomainPrice(
            rskRegistrar,
            domainString,
            years,
          )
          setSelectedDomainPrice(price)
          setIsCalculatingPrice(false)
        }
      } catch (err) {
        setIsCalculatingPrice(false)
      }
    },
    [years, getRnsProcessor],
  )

  const handleYearsChange = useCallback(
    async (changedYears: number) => {
      try {
        const rskRegistrar = getRnsProcessor()?.rskRegistrar

        if (rskRegistrar) {
          setIsCalculatingPrice(true)
          setValue('years', changedYears)
          const price = await calculateRnsDomainPrice(
            rskRegistrar,
            domain,
            changedYears,
          )
          setSelectedDomainPrice(price)
          setIsCalculatingPrice(false)
        }
      } catch (err) {
        setIsCalculatingPrice(false)
      }
    },
    [domain, setValue, getRnsProcessor],
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
    const rskRegistrar = getRnsProcessor()?.rskRegistrar

    if (!rskRegistrar) {
      showMessage(getPopupMessage(t('popup_not_possible_to_register_rns')))
      return
    }

    calculateRnsDomainPrice(rskRegistrar, domain, years).then(
      setSelectedDomainPrice,
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            {rnsProcessor ? (
              <DomainInput
                address={address}
                rskRegistrar={rnsProcessor.rskRegistrar}
                inputName={'domain'}
                error={errors.domain}
                domainValue={domain}
                onDomainOwned={setIsDomainOwned}
                onDomainAvailable={handleDomainAvailable}
                onResetValue={() => {
                  resetField('domain')
                }}
              />
            ) : null}
          </View>
          {!isDomainOwned && (
            <Input
              inputName={'years'}
              isReadOnly
              label={t('request_username_label')}
              value={`${years} ${
                years > 1
                  ? t('request_username_years')
                  : t('request_username_year')
              } `}
              subtitle={`${selectedDomainPrice} ${
                rifToken.symbol
              } ($ ${selectedDomainPriceInUsd}) ${t(
                'transaction_summary_plus_fees_capitalcase',
              )}`}
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
          )}

          {error !== '' && (
            <Typography
              type="body1"
              style={styles.errorTypography}
              accessibilityLabel="rejectedTransaction">
              {error}
            </Typography>
          )}
          {(profileStatus === ProfileStatus.REQUESTING ||
            currentStatus === 'loading') && (
            <>
              <View style={[sharedStyles.contentCenter]}>
                <AppSpinner size={64} thickness={10} />
              </View>
              <Typography type="body1" accessibilityLabel={'loading'}>
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
              profileStatus === ProfileStatus.REQUESTING ||
              isCalculatingPrice
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
            loading={isCalculatingPrice}
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
      <ConfirmationModal
        isVisible={isModalVisible && isDeployed}
        title={t('request_username_popup_title')}
        description={t('request_username_popup_description')}
        okText={t('request_username_popup_confirm')}
        onOk={() => setIsModalVisible(false)}
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
