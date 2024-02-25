import config from 'config.json'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Checkbox } from 'components/checkbox'
import { AppButton, AppTouchable, Typography } from 'components/index'
import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { SETTINGS } from 'src/core/types'

enum TestID {
  IAgreeCheckbox = 'Checkbox.IAgreeCheckbox',
  ContinueButton = 'Button.ContinueButton',
}
export const SecurityInformation = ({
  navigation,
  route: { params },
}: CreateKeysScreenProps<createKeysRouteNames.SecurityInformation>) => {
  const { moveTo } = params
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const [isCheckboxActive, setIsCheckboxActive] = useState(false)

  const onToggleCheckbox = useCallback(() => {
    setIsCheckboxActive(prev => !prev)
  }, [])

  const onButtonPress = useCallback(() => {
    navigation.navigate(moveTo)
  }, [navigation, moveTo])

  return (
    <View style={sharedStyles.screen}>
      <Typography type={'h2'} style={styles.header}>
        {t('security_info_header')}
      </Typography>
      <View style={styles.userAgreementBox}>
        <Typography type={'h3'} style={sharedStyles.textCenter}>
          {t('security_info_user_agreement')}
        </Typography>
        <Typography
          type={'body2'}
          style={[styles.disclaimerText, styles.disclaimerFirstText]}>
          {t('security_info_disclaimer')}
        </Typography>
        <Typography type={'body2'} style={styles.disclaimerText}>
          {t('security_info_disclaimer2')}
        </Typography>
        <Typography type={'body2'} style={styles.disclaimerText}>
          {t('security_info_disclaimer3')}
        </Typography>
        <Typography type={'body2'} style={styles.disclaimerText}>
          {t('security_info_disclaimer4')}
        </Typography>
      </View>
      <View style={[styles.checkboxBtnWrapper, { bottom: insets.bottom }]}>
        <View style={styles.termsAndConditionsView}>
          <TouchableOpacity
            accessibilityLabel="termsAndConditions"
            onPress={() =>
              Linking.openURL(config[SETTINGS.TERMS_AND_CONDITIONS_URL]).catch(
                err => console.error("Couldn't load page", err),
              )
            }>
            <Typography type="body1" style={styles.termsAndConditionsText}>
              {t('security_terms_and_conditions')}
            </Typography>
          </TouchableOpacity>
        </View>
        <View style={styles.agreementView}>
          <AppTouchable
            width={18}
            onPress={onToggleCheckbox}
            accessibilityLabel={TestID.IAgreeCheckbox}>
            <Checkbox isEnabled={isCheckboxActive} size={18} />
          </AppTouchable>
          <Typography type={'body2'} style={styles.agreeText}>
            {t('security_i_agree')}
          </Typography>
        </View>
        <AppButton
          onPress={onButtonPress}
          style={styles.button}
          title={t('security_info_btn')}
          disabled={!isCheckboxActive}
          color={sharedColors.white}
          textColor={sharedColors.text.secondary}
          accessibilityLabel={TestID.ContinueButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: castStyle.text({
    marginTop: 10,
    letterSpacing: -0.03,
  }),
  checkboxBtnWrapper: castStyle.view({
    position: 'absolute',
    right: 24,
    left: 24,
  }),
  userAgreementBox: castStyle.view({
    marginTop: 29,
    backgroundColor: sharedColors.inputInactive,
    paddingVertical: 48,
    paddingHorizontal: 40,
  }),
  disclaimerFirstText: castStyle.text({ marginTop: 11 }),
  disclaimerText: castStyle.text({
    marginTop: 22,
    textAlign: 'center',
    lineHeight: 18,
    color: sharedColors.text.label,
  }),
  termsAndConditionsView: castStyle.view({
    alignSelf: 'center',
    marginBottom: 22,
  }),
  termsAndConditionsText: castStyle.text({
    color: sharedColors.text.link,
    textDecorationLine: 'underline',
  }),
  agreementView: castStyle.view({ flexDirection: 'row', alignSelf: 'center' }),
  agreeText: castStyle.text({ marginLeft: 10 }),
  button: castStyle.view({ marginTop: 22 }),
})
