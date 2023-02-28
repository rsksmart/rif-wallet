import { useState, useCallback } from 'react'
import { StyleSheet, View, ScrollView, Share, Clipboard } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useTranslation } from 'react-i18next'

import { ProfileStore } from 'store/slices/profileSlice/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { AppButton, Avatar, Input, Typography } from 'components/index'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { castStyle } from 'shared/utils'
import { defaultIconSize, sharedColors } from 'shared/constants'
import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import { shortAddress } from 'lib/utils'
import { sharedStyles } from 'shared/styles'
import { InfoBox } from 'components/InfoBox'
import { setProfile } from 'store/slices/profileSlice'
import { selectActiveWallet } from 'store/slices/settingsSlice'
export const ProfileCreateScreen = ({
  navigation,
}: ProfileStackScreenProps<profileStackRouteNames.ProfileCreateScreen>) => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)
  const [isInfoBoxVisible, setIsInfoBoxVisible] = useState<boolean>(true)
  const [username] = useState<string>('No username')
  const [localProfile, setLocalProfile] = useState<ProfileStore>(profile)
  const methods = useForm()

  const onSetEmail = (email: string) => {
    setLocalProfile(prev => ({ ...prev, email }))
    dispatch(setProfile(localProfile))
  }

  const onSetPhone = (phone: string) => {
    setLocalProfile(prev => ({ ...prev, phone }))
    dispatch(setProfile(localProfile))
  }

  const resetPhone = () => {
    setLocalProfile(prev => ({ ...prev, phone: '' }))
  }
  const resetEmail = () => {
    setLocalProfile(prev => ({ ...prev, email: '' }))
  }
  const { wallet } = useAppSelector(selectActiveWallet)
  const onBackPress = useCallback(() => navigation.goBack(), [navigation])

  const onShareUsername = useCallback(() => {
    Share.share({
      message: username,
    })
  }, [username])
  const { t } = useTranslation()

  return (
    <ScrollView style={{ backgroundColor: sharedColors.secondary }}>
      <View style={styles.headerStyle}>
        <View style={styles.flexView}>
          <FontAwesome5Icon
            name="chevron-left"
            size={14}
            color="white"
            onPress={onBackPress}
            style={styles.width50View}
          />
        </View>
        <View style={[styles.flexView, styles.flexCenter]}>
          <Typography type="h3">{'Profile'}</Typography>
        </View>
        <View style={styles.flexView} />
      </View>
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
            {shortAddress(wallet?.smartWallet.smartWalletAddress)}
          </Typography>
        </View>
      </View>
      <BarButtonGroupContainer backgroundColor={sharedColors.primaryDark}>
        <BarButtonGroupIcon
          iconName="qr-code"
          IconComponent={MaterialIcon}
          onPress={() => {}}
        />
        <BarButtonGroupIcon
          iconName="share"
          IconComponent={MaterialIcon}
          onPress={onShareUsername}
        />
      </BarButtonGroupContainer>

      <View style={styles.bodyContainer}>
        {isInfoBoxVisible ? (
          <InfoBox
            avatar={username}
            title={'Username & Icon'}
            description={t('info_box_description_search_domain')}
            buttonText={'Close'}
            backgroundColor={sharedColors.primary}
            avatarBackgroundColor={sharedColors.secondary}
            onPress={() => setIsInfoBoxVisible(false)}
          />
        ) : null}
        <FormProvider {...methods}>
          <Input
            style={sharedStyles.marginTop}
            label="Address"
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
            style={sharedStyles.marginTop}>
            {'Contact Details'}
          </Typography>
          <Input
            value={localProfile?.phone}
            onChangeText={onSetPhone}
            label="Phone Number"
            inputName="Phone Number"
            placeholder={'Phone Number'}
            testID={'TestID.PhoneText'}
            resetValue={resetPhone}
            autoCorrect={false}
            autoCapitalize={'none'}
          />

          <Input
            value={localProfile?.email}
            onChangeText={onSetEmail}
            label="Email"
            inputName="email"
            placeholder={'Email'}
            testID={'TestID.EmailText'}
            resetValue={resetEmail}
            autoCorrect={false}
            autoCapitalize={'none'}
          />
          <AppButton
            style={sharedStyles.marginTop}
            title={'Register your username'}
            color={sharedColors.white}
            textColor={sharedColors.black}
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
  bodyContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  headerStyle: castStyle.view({
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: sharedColors.primary,
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
  flexView: castStyle.view({
    flex: 1,
  }),
  width50View: castStyle.view({
    width: '50%',
  }),
  flexCenter: castStyle.view({
    alignItems: 'center',
  }),
})
