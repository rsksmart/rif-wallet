import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'

import {
  AppButton,
  AppButtonBackgroundVarietyEnum,
  Typography,
} from 'components/index'
import { RifLogo } from 'components/icons/RifLogo'
import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator'
import { WINDOW_HEIGHT, sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

export const CreateKeysScreen = ({
  navigation,
}: CreateKeysScreenProps<createKeysRouteNames.CreateKeys>) => {
  const { t } = useTranslation()

  return (
    <View style={styles.screen}>
      <Image
        source={require('assets/images/initial_screen.jpg')}
        style={styles.background}
        resizeMethod={'scale'}
        resizeMode={'cover'}
      />
      <View style={styles.rifLogoContainer}>
        <RifLogo />
        <Typography style={styles.rifLogoText} type={'h1'}>
          {t('initial_screen_title')}
        </Typography>
      </View>
      <Typography type={'body3'} style={styles.footerText}>
        {t('initial_screen_welcome_footer')}
      </Typography>
      <View style={[styles.buttonContainer]}>
        <AppButton
          onPress={() =>
            navigation.navigate(createKeysRouteNames.SecurityInformation, {
              moveTo: createKeysRouteNames.NewMasterKey,
            })
          }
          accessibilityLabel={'newWallet'}
          title={t('initial_screen_button_create')}
          color={sharedColors.white}
          textColor={sharedColors.black}
        />

        <AppButton
          onPress={() =>
            navigation.navigate(createKeysRouteNames.SecurityInformation, {
              moveTo: createKeysRouteNames.ImportMasterKey,
            })
          }
          accessibilityLabel={'importWallet'}
          title={t('initial_screen_button_import')}
          style={styles.importWalletButton}
          backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: castStyle.view({
    flex: 1,
  }),
  background: castStyle.image({
    position: 'absolute',
    height: '100%',
    width: '100%',
  }),
  rifLogoContainer: castStyle.view({
    position: 'absolute',
    top: 290,
    left: 30,
  }),
  rifLogoText: castStyle.text({
    fontWeight: '300',
    fontSize: 28,
    color: sharedColors.black,
  }),
  buttonContainer: castStyle.view({
    position: 'absolute',
    bottom: 34,
    left: 30,
    right: 30,
  }),
  footerText: castStyle.text({
    position: 'absolute',
    width: 185,
    lineHeight: 15.6,
    bottom: WINDOW_HEIGHT * 0.26,
    left: 24,
  }),
  importWalletButton: castStyle.view({
    marginTop: 8,
  }),
})
