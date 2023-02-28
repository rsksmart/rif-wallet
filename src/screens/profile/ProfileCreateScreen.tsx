import { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import Icon from 'react-native-vector-icons/FontAwesome'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

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

export const ProfileCreateScreen = ({
  navigation,
}: ProfileStackScreenProps<profileStackRouteNames.ProfileCreateScreen>) => {
  const [isInfoBoxVisible, setIsInfoBoxVisible] = useState<boolean>(true)

  const methods = useForm()

  return (
    <ScrollView style={{ backgroundColor: sharedColors.secondary }}>
      <View style={styles.headerStyle}>
        <View style={styles.flexView}>
          <FontAwesome5Icon
            name="chevron-left"
            size={14}
            color="white"
            onPress={() => {}}
            style={styles.width50View}
          />
        </View>
        <View style={[styles.flexView, styles.flexCenter]}>
          <Typography type="h3">{'Profile'}</Typography>
        </View>
        <View style={styles.flexView} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 40,
          paddingTop: 10,
          paddingBottom: 30,
          backgroundColor: sharedColors.primary,
        }}>
        <Avatar
          size={50}
          name={'hola'}
          style={{ backgroundColor: 'white' }}
          letterColor={sharedColors.labelLight}
        />
        <View
          style={{
            justifyContent: 'center',
            paddingLeft: 10,
          }}>
          <Typography type={'h3'} color={sharedColors.labelLight}>
            {'No username'}
          </Typography>
          <Typography type={'h4'} color={sharedColors.labelLight}>
            {shortAddress('0x4A727D7943B563462C96d40689836600d20b983B')}
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
          onPress={() => {}}
        />
      </BarButtonGroupContainer>

      <View style={styles.bodyContainer}>
        {isInfoBoxVisible ? (
          <InfoBox
            avatar={'Username & Icon'}
            title={'Username & Icon'}
            description={
              'Register your username to allow others to send you funds more easily. In case you do not have any RIF funds you can ask a friend to send you some RIF.\n'
            }
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
              />
            }
            placeholder={shortAddress(
              '0x4A727D7943B563462C96d40689836600d20b983B',
            )}
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
            label="Phone Number"
            inputName="phoneNumber"
            placeholder={'Phone Number'}
            testID={'TestID.AddressText'}
          />

          <Input
            label="Email"
            inputName="email"
            placeholder={'Email'}
            testID={'TestID.AddressText'}
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
