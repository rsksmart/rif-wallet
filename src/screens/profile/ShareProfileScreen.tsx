import { useCallback, useState, useEffect } from 'react'
import { StyleSheet, View, Share } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { sharedColors } from 'shared/constants'
import { useAppSelector } from 'store/storeUtils'
import { castStyle } from 'shared/utils'
import { selectProfile } from 'store/slices/profileSlice'
import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import { QRGenerator } from 'components/QRGenerator/QRGenerator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { headerLeftOption } from 'navigation/profileNavigator'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
}

export const ShareProfileScreen = ({
  navigation,
}: ProfileStackScreenProps<profileStackRouteNames.ShareProfileScreen>) => {
  const profile = useAppSelector(selectProfile)
  const [username] = useState<string>(
    profile?.alias !== '' ? profile.alias : 'No username',
  )

  const onShareUsername = useCallback(() => {
    Share.share({
      message: username,
    })
  }, [username])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
      headerStyle: {
        backgroundColor: sharedColors.background.primary,
      },
    })
  }, [navigation])

  return (
    <View style={styles.parent}>
      <View style={styles.qrView}>
        <QRGenerator
          key={username}
          value={username}
          imageSource={require('../../../assets/images/profile.png')}
          qrBackgroundColor={sharedColors.primary}
          logoBackgroundColor={sharedColors.primary}
          testID={TestID.QRCodeDisplay}
        />
      </View>
      <BarButtonGroupContainer backgroundColor={sharedColors.primaryDark}>
        <BarButtonGroupIcon
          iconName="share"
          IconComponent={MaterialIcon}
          onPress={onShareUsername}
        />
      </BarButtonGroupContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: castStyle.view({
    backgroundColor: sharedColors.primary,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
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
  qrView: castStyle.view({
    paddingHorizontal: 45,
    paddingVertical: 84,
    borderRadius: 20,
    marginTop: 5,
  }),
  headerPosition: castStyle.view({
    marginTop: -50,
  }),
})
