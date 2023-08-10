import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppButton, AppTouchable, Typography } from 'components/index'
import { Checkbox } from 'components/checkbox'

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
    <View style={sharedStyles.container}>
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
          textColor={sharedColors.black}
          accessibilityLabel={TestID.ContinueButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: castStyle.text({ marginTop: 10, letterSpacing: -0.03 }),
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
    color: sharedColors.labelLight,
  }),
  agreementView: castStyle.view({ flexDirection: 'row', alignSelf: 'center' }),
  agreeText: castStyle.text({ marginLeft: 10 }),
  button: castStyle.view({ marginTop: 22 }),
})
