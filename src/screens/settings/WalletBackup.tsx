import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { KeyManagementSystem } from 'lib/core'

import { sharedColors } from 'shared/constants'
import {
  AppButton,
  AppButtonBackgroundVarietyEnum,
  MnemonicComponent,
  Typography,
} from 'components/index'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { resetApp } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { castStyle } from 'shared/utils'
import { getKeys } from 'storage/SecureStorage'
import { ConfirmationModal, ConfirmationModalConfig } from 'components/modal'

type Props = SettingsScreenProps<settingsStackRouteNames.WalletBackup>

export const WalletBackup = (_: Props) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState<boolean>(false)

  const deleteWallet = useCallback(async () => {
    setIsDeleteConfirmationVisible(false)
    await dispatch(resetApp())
  }, [dispatch])

  const createDeleteDefinitiveConfirmationConfig =
    useCallback((): ConfirmationModalConfig => {
      return {
        color: sharedColors.dangerLight,
        title: t(
          'wallet_backup_definitive_delete_confirmation_title',
        ) as string,
        titleColor: sharedColors.black,
        description: t(
          'wallet_backup_definitive_delete_confirmation_description',
        ),
        descriptionColor: sharedColors.black,
        okText: t('Delete'),
        cancelText: t('Cancel'),
        buttons: [
          { color: sharedColors.black, textColor: sharedColors.white },
          { color: sharedColors.black, textColor: sharedColors.black },
        ],
        onOk: deleteWallet,
        onCancel: () => {
          setIsDeleteConfirmationVisible(false)
        },
      }
    }, [t, deleteWallet])

  const createDeleteConfirmationConfig =
    useCallback((): ConfirmationModalConfig => {
      return {
        color: sharedColors.dangerLight,
        title: t('wallet_backup_delete_confirmation_title') as string,
        titleColor: sharedColors.black,
        description: t(
          'wallet_backup_delete_confirmation_description',
        ) as string,
        descriptionColor: sharedColors.black,
        okText: t('Delete') as string,
        cancelText: t('Cancel') as string,
        buttons: [
          { color: sharedColors.black, textColor: sharedColors.white },
          { color: sharedColors.black, textColor: sharedColors.black },
        ],
        onOk: () => {
          setConfirmationModalConfig(createDeleteDefinitiveConfirmationConfig())
        },
        onCancel: () => {
          setIsDeleteConfirmationVisible(false)
          setConfirmationModalConfig(createDeleteConfirmationConfig())
        },
      }
    }, [t, createDeleteDefinitiveConfirmationConfig])

  const [confirmationModalConfig, setConfirmationModalConfig] =
    useState<ConfirmationModalConfig>(createDeleteConfirmationConfig)
  const [mnemonic, setMnemonic] = useState<string | null>()
  const mnemonicArray = mnemonic ? mnemonic.split(' ') : []

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

  return (
    <ScrollView style={styles.container}>
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
        style={styles.deleteButton}
      />
      <ConfirmationModal
        isVisible={isDeleteConfirmationVisible}
        color={confirmationModalConfig.color}
        title={confirmationModalConfig.title}
        titleColor={confirmationModalConfig.titleColor}
        description={confirmationModalConfig.description}
        descriptionColor={confirmationModalConfig.descriptionColor}
        okText={confirmationModalConfig.okText}
        cancelText={confirmationModalConfig.cancelText}
        buttons={confirmationModalConfig.buttons}
        onOk={confirmationModalConfig.onOk}
        onCancel={confirmationModalConfig.onCancel}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    backgroundColor: sharedColors.secondary,
    paddingHorizontal: 24,
  }),
  content: castStyle.view({
    marginTop: 24,
  }),
  title: castStyle.text({
    marginVertical: 24,
  }),
  deleteButton: castStyle.view({
    marginTop: 24,
  }),
})
