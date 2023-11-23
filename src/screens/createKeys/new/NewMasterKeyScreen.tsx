import { CompositeScreenProps } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { generateMnemonic } from '@rsksmart/rif-id-mnemonic'

import {
  AppButton,
  Typography,
  MnemonicComponent,
  AppButtonBackgroundVarietyEnum,
} from 'components/index'
import { StepperComponent } from 'components/profile'
import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle, usePreventScreenshot } from 'shared/utils'
import { useAppDispatch } from 'store/storeUtils'
import { createWallet } from 'store/slices/settingsSlice'
import { saveKeyVerificationReminder } from 'storage/MainStorage'
import { useInitializeWallet } from 'shared/wallet'

type Props = CompositeScreenProps<
  CreateKeysScreenProps<createKeysRouteNames.NewMasterKey>,
  RootTabsScreenProps<rootTabsRouteNames.CreateKeysUX>
>

enum TestID {
  SecureLaterButton = 'SecureLater',
}

export const NewMasterKeyScreen = ({ navigation }: Props) => {
  const initializeWallet = useInitializeWallet()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  usePreventScreenshot(t)
  const mnemonic = useMemo(() => generateMnemonic(12), [])
  const [isMnemonicVisible, setIsMnemonicVisible] = useState(false)

  const onSecureLater = useCallback(async () => {
    saveKeyVerificationReminder(true)
    dispatch(
      createWallet({
        mnemonic,
        initializeWallet,
      }),
    )
  }, [dispatch, initializeWallet, mnemonic])

  return (
    <View style={styles.screen}>
      <StepperComponent
        style={sharedStyles.selfCenter}
        width={40}
        colors={[sharedColors.primary, sharedColors.inputInactive]}
      />
      <Typography
        style={styles.titleText}
        type={'h2'}
        accessibilityLabel={'saveYourPhrase'}>
        {t('new_master_key_title')}
      </Typography>
      <MnemonicComponent
        style={styles.mnemonicComponent}
        onToggleMnemonic={setIsMnemonicVisible}
        words={mnemonic.split(' ')}
      />
      <View style={styles.button}>
        <AppButton
          title={t('new_master_key_button_title')}
          disabled={!isMnemonicVisible}
          color={sharedColors.white}
          textColor={sharedColors.black}
          textType={'h4'}
          onPress={() =>
            navigation.navigate(createKeysRouteNames.ConfirmNewMasterKey, {
              mnemonic,
            })
          }
        />
        <AppButton
          style={styles.secureLaterBtn}
          title={t('new_master_key_secure_later_button')}
          color={sharedColors.white}
          textColor={sharedColors.white}
          textType={'h4'}
          backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
          onPress={onSecureLater}
          accessibilityLabel={TestID.SecureLaterButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.black,
    paddingHorizontal: 24,
  }),
  titleText: castStyle.text({
    marginTop: 58,
  }),
  mnemonicComponent: castStyle.view({
    marginTop: 30,
  }),
  button: castStyle.view({
    position: 'absolute',
    bottom: 22,
    left: 24,
    right: 24,
  }),
  secureLaterBtn: castStyle.view({ marginTop: 8 }),
})
