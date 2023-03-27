import { useEffect, useState } from 'react'
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

type Props =
  SettingsScreenProps<settingsStackRouteNames.SecurityConfigurationScreen>

export const WalletBackup = ({ navigation }: Props) => {
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState<boolean>(false)
  const [mnemonic, setMnemonic] = useState<string | null>()
  const mnemonicArray = mnemonic ? mnemonic.split(' ') : []

  const dispatch = useAppDispatch()

  const deleteWallet = () => {
    dispatch(resetApp())
    saveKeyVerificationReminder(false)
    setIsDeleteConfirmationVisible(false)
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
          View your phrase
        </Typography>
        <MnemonicComponent words={mnemonicArray} showAdvice={false} />
      </View>
      <AppButton
        title="Delete Wallet"
        style={styles.button}
        onPress={() => setIsDeleteConfirmationVisible(true)}
        backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
        color={sharedColors.white}
      />
      <SlidePopupConfirmationDanger
        isVisible={isDeleteConfirmationVisible}
        height={320}
        onConfirm={deleteWallet}
        onCancel={() => setIsDeleteConfirmationVisible(false)}
        confirmText="Delete"
        cancelText="Cancel"
        title="Delete Wallet?"
        description="Proceeding with deleting your wallet will result in loss of funds and all the information saved."
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
  button: castStyle.view({
    height: 50,
  }),
})
