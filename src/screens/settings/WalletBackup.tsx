import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { sharedColors } from 'shared/constants'
import {
  AppButton,
  AppButtonBackgroundVarietyEnum,
  MnemonicComponent,
  Typography,
} from 'src/components'
import { KeyManagementSystem } from 'src/lib/core'
import { headerLeftOption } from 'src/navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'src/navigation/settingsNavigator/types'
import { castStyle } from 'src/shared/utils'
import { getKeys } from 'src/storage/SecureStorage'

type Props =
  SettingsScreenProps<settingsStackRouteNames.SecurityConfigurationScreen>

export const WalletBackup = ({ navigation }: Props) => {
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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography type="h2" style={styles.title}>
          View your phrase
        </Typography>
        <MnemonicComponent words={mnemonicArray} showAdvice={false} />
      </View>
      <AppButton
        title="Delete Wallet"
        onPress={() => {}}
        backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
        color={sharedColors.white}
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
