import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Clipboard, ScrollView, Share, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { shortAddress } from 'lib/utils'

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
import {
  defaultIconSize,
  sharedColors,
  sharedStyles as sharedStylesConstants,
} from 'shared/constants'
import { sharedStyles } from 'shared/styles'
import { castStyle } from 'shared/utils'
import { setProfile, setStatus } from 'store/slices/profileSlice'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { AppSpinner } from 'components/index'
import { AvatarIcon } from 'components/icons/AvatarIcon'

import { rnsManagerStyles } from '../rnsManager/rnsManagerStyles'

export const ProfileCreateScreen = ({
  navigation,
}: ProfileStackScreenProps<profileStackRouteNames.ProfileCreateScreen>) => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)
  const [infoBoxClosed, setInfoBoxClosed] = useState<boolean>(
    profile.infoBoxClosed ?? false,
  )

  const [username, setUsername] = useState<string>('')
  const methods = useForm()
  const { resetField, setValue } = methods
  const { t } = useTranslation()

  const { wallet, chainType } = useAppSelector(selectActiveWallet)
  const { displayAddress } = getAddressDisplayText(
    wallet?.smartWallet.smartWalletAddress ?? '',
    chainType,
  )

  const onSetEmail = useCallback(
    (_email: string) => {
      dispatch(setProfile({ ...profile, email: _email }))
    },
    [dispatch, profile],
  )

  const onSetPhone = useCallback(
    (_phone: string) => {
      dispatch(setProfile({ ...profile, phone: _phone }))
    },
    [dispatch, profile],
  )

  const resetPhone = useCallback(() => {
    resetField('phone')
    dispatch(setProfile({ ...profile, phone: '' }))
  }, [dispatch, profile, resetField])

  const resetEmail = useCallback(() => {
    resetField('email')
    dispatch(setProfile({ ...profile, email: '' }))
  }, [dispatch, profile, resetField])

  const onShareUsername = useCallback(() => {
    Share.share({ message: username })
  }, [username])

  const closeInfoBox = useCallback(() => {
    setInfoBoxClosed(true)
    dispatch(setProfile({ ...profile, infoBoxClosed: true }))
  }, [dispatch, profile])

  useEffect(() => {
    if (profile.status === ProfileStatus.READY_TO_PURCHASE) {
      navigation.reset({
        index: 0,
        routes: [{ name: profileStackRouteNames.PurchaseDomain }],
      })
    }
  }, [navigation, profile.status])

  useEffect(() => {
    const hasAlias = profile.status !== ProfileStatus.NONE && !!profile.alias
    setUsername(hasAlias ? profile.alias : '')
  }, [profile.alias, profile.status])

  useEffect(() => {
    setValue('email', profile.email)
    setValue('phone', profile.phone)
  }, [profile.email, profile.phone, setValue])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])

  return (
    <ScrollView
      style={rnsManagerStyles.scrollContainer}
      automaticallyAdjustContentInsets
      automaticallyAdjustKeyboardInsets>
      <View style={styles.usernameContainer}>
        {username ? (
          <AvatarIcon size={50} value={username} />
        ) : (
          <Avatar size={50} name="username" style={styles.avatarBackground} />
        )}
        <View style={styles.username}>
          <Typography type={'h3'} color={sharedColors.white}>
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
                color={sharedColors.white}
                size={defaultIconSize}
                onPress={() =>
                  Clipboard.setString(
                    wallet?.smartWallet.smartWalletAddress || '',
                  )
                }
              />
            }
            placeholder={shortAddress(wallet?.smartWallet.smartWalletAddress)}
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
            testID={'TestID.PhoneText'}
            resetValue={resetPhone}
            autoCorrect={false}
            autoCapitalize={'none'}
          />

          <Input
            onChangeText={onSetEmail}
            label={t('profile_email_label')}
            inputName="email"
            placeholder={t('profile_email_label')}
            testID={'TestID.EmailText'}
            resetValue={resetEmail}
            autoCorrect={false}
            autoCapitalize={'none'}
          />
          {profile.status === ProfileStatus.REQUESTING && (
            <>
              <View style={[sharedStylesConstants.contentCenter]}>
                <AppSpinner size={64} thickness={10} />
              </View>
              <Typography type="body1">
                {t('search_domain_processing_commitment')}
              </Typography>
            </>
          )}
          <AppButton
            style={rnsManagerStyles.button}
            title={t('profile_register_your_username_button_text')}
            color={sharedColors.white}
            textColor={sharedColors.black}
            disabled={
              profile.status === ProfileStatus.PURCHASING ? false : !!username
            }
            onPress={() => {
              if (profile.status === ProfileStatus.PURCHASING) {
                // For some reason the user got stuck in PURCHASING - set it back one step
                // The PurchaseScreen will render automatically
                dispatch(setStatus(ProfileStatus.READY_TO_PURCHASE))
              } else {
                navigation.navigate(profileStackRouteNames.SearchDomain)
              }
            }}
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
})
