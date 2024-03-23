import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, Share, StyleSheet, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import Icon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import {
  AppButton,
  Avatar,
  getAddressDisplayText,
  Input,
  Typography,
} from 'components/index'
import { InfoBox } from 'components/InfoBox'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
  ProfileStatus,
} from 'navigation/profileNavigator/types'
import { defaultIconSize, sharedColors } from 'shared/constants'
import { sharedStyles } from 'shared/styles'
import { castStyle } from 'shared/utils'
import {
  commitment,
  setEmail,
  setPhone,
  setInfoBoxClosed as setGlobalStateInfoBoxClosed,
  setStatus,
} from 'store/slices/profileSlice'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { selectChainId, selectRequests } from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { AvatarIcon } from 'components/icons/AvatarIcon'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { useGetRnsProcessor, useWallet } from 'shared/wallet'

import { rnsManagerStyles } from '../rnsManager/rnsManagerStyles'

export const ProfileCreateScreen = ({
  navigation,
}: ProfileStackScreenProps<profileStackRouteNames.ProfileCreateScreen>) => {
  const { address } = useWallet()
  const getRnsProcessor = useGetRnsProcessor()

  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)
  const { alias, status, email, phone } = profile
  const chainId = useAppSelector(selectChainId)

  const [infoBoxClosed, setInfoBoxClosed] = useState<boolean>(
    profile.infoBoxClosed ?? false,
  )
  const requests = useAppSelector(selectRequests)

  const [username, setUsername] = useState<string>('')
  const methods = useForm()
  const { resetField, setValue } = methods
  const { t } = useTranslation()

  const { displayAddress } = getAddressDisplayText(address, chainId)
  const isRequestingAlias = status === ProfileStatus.REQUESTING
  const isPurchasingProfile = status === ProfileStatus.PURCHASING
  const isWaitingForCommit = status === ProfileStatus.WAITING_FOR_USER_COMMIT

  const onSetEmail = useCallback(
    (_email: string) => {
      dispatch(setEmail(_email))
    },
    [dispatch],
  )

  const onSetPhone = useCallback(
    (_phone: string) => {
      dispatch(setPhone(_phone))
    },
    [dispatch],
  )

  const onCopyAddress = useCallback(() => {
    Clipboard.setString(address)
  }, [address])

  const resetPhone = useCallback(() => {
    resetField('phone')
    dispatch(setPhone(''))
  }, [dispatch, resetField])

  const resetEmail = useCallback(() => {
    resetField('email')
    dispatch(setEmail(''))
  }, [dispatch, resetField])

  const onShareUsername = useCallback(() => {
    Share.share({ message: username })
  }, [username])

  const closeInfoBox = useCallback(() => {
    setInfoBoxClosed(true)
    dispatch(setGlobalStateInfoBoxClosed(true))
  }, [dispatch])

  useEffect(() => {
    if (status === ProfileStatus.READY_TO_PURCHASE) {
      navigation.reset({
        index: 0,
        routes: [{ name: profileStackRouteNames.PurchaseDomain }],
      })
    }
  }, [navigation, status])

  useEffect(() => {
    const hasAlias = status !== ProfileStatus.NONE && !!alias
    setUsername(hasAlias ? alias : '')
  }, [alias, status])

  useEffect(() => {
    setValue('email', email)
    setValue('phone', phone)
  }, [email, phone, setValue])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        headerLeftOption(() => navigation.navigate(rootTabsRouteNames.Home)),
    })
  }, [navigation])

  useEffect(() => {
    const fn = async () => {
      if (alias && isRequestingAlias) {
        await dispatch(
          commitment({
            alias: alias.split('.rsk')[0],
            getRnsProcessor,
          }),
        ).unwrap()
      }

      if (requests.length === 0) {
        if (isWaitingForCommit) {
          // User got stuck in requesting the commit - set profileStatus back to 0
          dispatch(setStatus(ProfileStatus.NONE))
        }
        if (isPurchasingProfile) {
          // User got stuck in requesting the purchase - set profileStatus back to 3
          dispatch(setStatus(ProfileStatus.READY_TO_PURCHASE))
        }
      }
    }
    fn()
  }, [
    dispatch,
    getRnsProcessor,
    alias,
    isRequestingAlias,
    isWaitingForCommit,
    isPurchasingProfile,
    requests.length,
  ])

  return (
    <ScrollView
      style={rnsManagerStyles.scrollContainer}
      automaticallyAdjustContentInsets
      // it exists for ios but shows error https://reactnative.dev/docs/scrollview#automaticallyadjustkeyboardinsets-ios
      automaticallyAdjustKeyboardInsets>
      <View style={styles.usernameContainer}>
        {username ? (
          <AvatarIcon size={50} value={username} />
        ) : (
          <Avatar size={50} name="username" style={styles.avatarBackground} />
        )}
        <View style={styles.username}>
          <Typography
            type={'h3'}
            color={sharedColors.white}
            accessibilityLabel={'username'}>
            {username || t('no_username')}
          </Typography>
          <Typography type={'h4'} color={sharedColors.labelLight}>
            {displayAddress}
          </Typography>
        </View>
      </View>

      <BarButtonGroupContainer backgroundColor={sharedColors.primaryDark}>
        <BarButtonGroupIcon
          iconName="qr-code"
          IconComponent={MaterialIcon}
          onPress={() =>
            navigation.navigate(profileStackRouteNames.ShareProfileScreen)
          }
        />
        <BarButtonGroupIcon
          iconName="share"
          IconComponent={MaterialIcon}
          onPress={onShareUsername}
        />
      </BarButtonGroupContainer>

      <View style={rnsManagerStyles.container}>
        {!infoBoxClosed ? (
          <InfoBox
            avatar={username}
            title={t('info_box_title_search_domain')}
            description={t('info_box_description_search_domain')}
            buttonText={t('info_box_close_button')}
            backgroundColor={sharedColors.primary}
            avatarBackgroundColor={sharedColors.secondary}
            onPress={closeInfoBox}
          />
        ) : null}
        <FormProvider {...methods}>
          <Input
            style={sharedStyles.marginTop20}
            label={t('profile_address_label')}
            inputName="address"
            rightIcon={
              <Icon
                name={'copy'}
                style={styles.copyIcon}
                color={sharedColors.white}
                size={defaultIconSize}
                onPress={onCopyAddress}
              />
            }
            placeholder={displayAddress}
            isReadOnly
            testID={'TestID.AddressText'}
          />
          <Typography
            type={'h3'}
            color={sharedColors.labelLight}
            style={sharedStyles.marginTop20}>
            {t('profile_contact_details_subtitle')}
          </Typography>
          <Input
            onChangeText={onSetPhone}
            label={t('profile_phone_label')}
            inputName="phone"
            placeholder={t('profile_phone_label')}
            accessibilityLabel={'TestID.PhoneText'}
            resetValue={resetPhone}
            autoCorrect={false}
            autoCapitalize={'none'}
            isReadOnly={isRequestingAlias}
          />

          <Input
            onChangeText={onSetEmail}
            label={t('profile_email_label')}
            inputName="email"
            placeholder={t('profile_email_label')}
            accessibilityLabel={'TestID.EmailText'}
            resetValue={resetEmail}
            autoCorrect={false}
            autoCapitalize={'none'}
            isReadOnly={isRequestingAlias}
          />
          <AppButton
            style={rnsManagerStyles.button}
            title={t('profile_register_your_username_button_text')}
            accessibilityLabel={'registerYourUserName'}
            color={sharedColors.white}
            textColor={sharedColors.black}
            disabled={isPurchasingProfile ? false : !!username}
            onPress={() => {
              navigation.navigate(profileStackRouteNames.SearchDomain)
            }}
            loading={isRequestingAlias}
          />
        </FormProvider>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerStyle: castStyle.view({
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: sharedColors.primary,
  }),
  headerTittle: castStyle.view({
    paddingRight: 30,
  }),
  usernameContainer: castStyle.view({
    flexDirection: 'row',
    paddingLeft: 40,
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: sharedColors.primary,
  }),
  username: castStyle.view({
    justifyContent: 'center',
    paddingLeft: 10,
  }),
  avatarBackground: castStyle.view({
    backgroundColor: sharedColors.white,
  }),
  flexCenter: castStyle.view({
    alignItems: 'center',
  }),
  copyIcon: castStyle.image({
    padding: defaultIconSize,
  }),
})
