import { useIsFocused } from '@react-navigation/native'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { AppButton, Typography } from 'components/index'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { sharedColors } from 'shared/constants'
import { setFullscreen } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'

type Props =
  ProfileStackScreenProps<profileStackRouteNames.CongratulationsScreen>

export const CongratulationsScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(setFullscreen(isFocused))
  }, [dispatch, isFocused])

  return (
    <View style={styles.container}>
      <View style={styles.loading}>
        <ActivityIndicator
          color={sharedColors.white}
          size={174}
          animating={true}
        />
      </View>
      <View style={styles.content}>
        <Typography type="h2" color={sharedColors.white}>
          {t('request_username_congratulations_title')}
        </Typography>
        <Typography
          type="h3"
          color={sharedColors.white}
          style={styles.subtitle}>
          {t('request_username_congratulations_subtitle')}
        </Typography>
        <Typography
          type="h4"
          color={sharedColors.white}
          style={styles.description}>
          {t('request_username_congratulations_description')}
        </Typography>
      </View>
      <View style={styles.footer}>
        <AppButton
          title={t('close')}
          color={sharedColors.white}
          textColor={sharedColors.black}
          style={styles.closeButton}
          onPress={() => {
            navigation.navigate(profileStackRouteNames.ProfileCreateScreen)
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: sharedColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  subtitle: {
    marginTop: 10,
  },
  description: {
    marginTop: 30,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
  },
  closeButton: {
    width: '75%',
    height: 45,
    alignSelf: 'center',
  },
})
