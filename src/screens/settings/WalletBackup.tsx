import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { sharedColors } from 'shared/constants'
import {
  AppButton,
  AppButtonBackgroundVarietyEnum,
  MnemonicComponent,
  Typography,
} from 'src/components'
import { SlidePopupConfirmationDanger } from 'src/components/slidePopup/SlidePopupConfirmationDanger'
import { KeyManagementSystem } from 'src/lib/core'
import { headerLeftOption } from 'src/navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'src/navigation/settingsNavigator/types'
import { resetApp } from 'src/redux/slices/settingsSlice'
import { useAppDispatch } from 'src/redux/storeUtils'
import { castStyle } from 'src/shared/utils'
import { saveKeyVerificationReminder } from 'src/storage/MainStorage'
import { getKeys } from 'src/storage/SecureStorage'

type Props = SettingsScreenProps<settingsStackRouteNames.WalletBackup>

export const WalletBackup = ({ navigation }: Props) => {
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState<boolean>(false)
  const [
    isDefinitiveDeleteConfirmationVisible,
    setIsDefinitiveDeleteConfirmationVisible,
  ] = useState<boolean>(false)
  const [mnemonic, setMnemonic] = useState<string | null>()
  const mnemonicArray = mnemonic ? mnemonic.split(' ') : []

  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const deleteWallet = () => {
    dispatch(resetApp())
    saveKeyVerificationReminder(false)
    setIsDefinitiveDeleteConfirmationVisible(false)
  }

  useEffect(() => {
    const fn = async () => {
      const keys = await getKeys()
      if (keys) {
        const { kms } = KeyManagementSystem.fromSerialized(keys)
        setMnemonic(kms.mnemonic)
      }
    }
    fn()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography type="h2" style={styles.title}>
          {t('wallet_backup_subtitle')}
        </Typography>
        <MnemonicComponent words={mnemonicArray} showAdvice={false} />
      </View>
      <AppButton
        title={t('wallet_backup_delete_button')}
        onPress={() => setIsDeleteConfirmationVisible(true)}
        backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
        color={sharedColors.white}
      />
      <SlidePopupConfirmationDanger
        isVisible={isDeleteConfirmationVisible}
        height={320}
        title={t('wallet_backup_delete_confirmation_title')}
        description={t('wallet_backup_delete_confirmation_description')}
        confirmText={t('Delete')}
        cancelText={t('Cancel')}
        onConfirm={() => {
          setIsDeleteConfirmationVisible(false)
          setIsDefinitiveDeleteConfirmationVisible(true)
        }}
        onCancel={() => setIsDeleteConfirmationVisible(false)}
      />
      <SlidePopupConfirmationDanger
        isVisible={isDefinitiveDeleteConfirmationVisible}
        height={320}
        title={t('wallet_backup_definitive_delete_confirmation_title')}
        description={t(
          'wallet_backup_definitive_delete_confirmation_description',
        )}
        confirmText={t('Delete')}
        cancelText={t('Cancel')}
        onConfirm={deleteWallet}
        onCancel={() => setIsDefinitiveDeleteConfirmationVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.secondary,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  }),
  content: castStyle.view({
    marginTop: 24,
  }),
  title: castStyle.text({
    marginVertical: 24,
  }),
})
