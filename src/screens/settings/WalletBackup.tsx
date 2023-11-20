import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import { sharedColors } from 'shared/constants'
import { MnemonicComponent, Typography } from 'components/index'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { castStyle, usePreventScreenshot } from 'shared/utils'
import { getKeys } from 'storage/SecureStorage'

type Props = SettingsScreenProps<settingsStackRouteNames.WalletBackup>

export const WalletBackup = (_: Props) => {
  const { t } = useTranslation()
  usePreventScreenshot(t)

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
})
