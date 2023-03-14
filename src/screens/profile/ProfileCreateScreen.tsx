import { useState, useCallback, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Share, Clipboard } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import Icon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useTranslation } from 'react-i18next'
import { shortAddress } from 'lib/utils'

import { castStyle } from 'shared/utils'
import { defaultIconSize, sharedColors } from 'shared/constants'
import { sharedStyles } from 'shared/styles'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { setProfile } from 'store/slices/profileSlice'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import {
  AppButton,
  Avatar,
  getAddressDisplayText,
  Input,
  Typography,
} from 'components/index'
import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import { InfoBox } from 'components/InfoBox'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { headerLeftOption } from 'navigation/profileNavigator'

export const ProfileCreateScreen = ({
  navigation,
}: ProfileStackScreenProps<profileStackRouteNames.ProfileCreateScreen>) => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)
  const [infoBoxClosed, setInfoBoxClosed] = useState<boolean>(
    profile.infoBoxClosed ?? false,
  )

  const [username, setUsername] = useState<string>('no_username')
  const methods = useForm()
  const { resetField, setValue } = methods

  useEffect(() => {
    setUsername(profile.alias ? profile.alias : 'no_username')
  }, [profile.alias])

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

  const { wallet, chainType } = useAppSelector(selectActiveWallet)
  const { displayAddress } = getAddressDisplayText(
    wallet?.smartWallet.smartWalletAddress ?? '',
    chainType,
  )

  const onShareUsername = useCallback(() => {
    Share.share({
      message: username,
    })
  }, [username])

  const closeInfoBox = useCallback(() => {
    setInfoBoxClosed(true)
    dispatch(setProfile({ ...profile, infoBoxClosed: true }))
  }, [dispatch, profile])

  useEffect(() => {
    setValue('email', profile.email)
    setValue('phone', profile.phone)
  }, [profile.email, profile.phone, setValue])
  const onBackPress = useCallback(() => navigation.goBack(), [navigation])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(onBackPress),
    })
  }, [navigation, onBackPress])
  const { t } = useTranslation()

  return (
    <ScrollView style={{ backgroundColor: sharedColors.secondary }}>
      <View style={styles.usernameContainer}>
        <Avatar
          size={50}
          name={username}
          style={styles.avatarBackground}
          letterColor={sharedColors.labelLight}
        />
        <View style={styles.username}>
          <Typography type={'h3'} color={sharedColors.labelLight}>
            {username}
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

      <View style={styles.bodyContainer}>
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
          <AppButton
            style={sharedStyles.marginTop20}
            title={t('profile_register_your_username_button_text')}
            color={sharedColors.white}
            textColor={sharedColors.black}
            disabled={!(username === 'no_username')}
            onPress={() =>
              navigation.navigate(profileStackRouteNames.SearchDomain)
            }
          />
        </FormProvider>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  bodyContainer: castStyle.view({
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  }),

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
  avatarBackground: castStyle.view({ backgroundColor: 'white' }),

  flexCenter: castStyle.view({
    alignItems: 'center',
  }),
})
