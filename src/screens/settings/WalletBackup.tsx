import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

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
import { castStyle, usePreventScreenshot } from 'shared/utils'
import { getKeys } from 'storage/SecureStorage'
import { DeleteWalletModal } from 'components/modal/deleteWalletModal'

type Props = SettingsScreenProps<settingsStackRouteNames.WalletBackup>

export const WalletBackup = (_: Props) => {
  const { t } = useTranslation()
  usePreventScreenshot(t)
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState<boolean>(false)

  const [mnemonic, setMnemonic] = useState<string | null>()
  const mnemonicArray = mnemonic ? mnemonic.split(' ') : []

  useEffect(() => {
    const fn = async () => {
      const keys = await getKeys()
      if (keys) {
        setMnemonic(keys.mnemonic)
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
      <DeleteWalletModal
        isVisible={isDeleteConfirmationVisible}
        setVisible={setIsDeleteConfirmationVisible}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    backgroundColor: sharedColors.black,
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
