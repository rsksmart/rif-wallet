import { useEffect, useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'

import { colors } from 'src/styles'
import { MediumText } from 'components/index'
import { PrimaryButton } from 'components/button/PrimaryButton'
import { SecondaryButton } from 'components/button/SecondaryButton'
import {
  getKeyVerificationReminder,
  hasKeyVerificationReminder,
  saveKeyVerificationReminder,
} from 'storage/MainStorage'
import { useAppDispatch } from 'store/storeUtils'
import { resetApp } from 'store/slices/settingsSlice'
import { createKeysRouteNames } from 'navigation/createKeysNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'

export const SecurityConfigurationScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.SecurityConfigurationScreen>) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const revealMasterKey = () =>
    navigation.navigate(settingsStackRouteNames.ShowMnemonicScreen)

  const changePin = () =>
    navigation.navigate(settingsStackRouteNames.ChangePinScreen)
  const [showReminder, setShowReminder] = useState<boolean>(false)

  const handleDeleteKeys = () => {
    Alert.alert(
      'Reset App',
      'Confirm you want to reset the app. This will delete your master key, pin, saved domains and contacts',
      [
        {
          text: t('Cancel'),
          onPress: () => undefined,
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(resetApp())
            saveKeyVerificationReminder(false)
          },
        },
      ],
    )
  }

  async function checkReminder() {
    const reminderIsSet = hasKeyVerificationReminder()
    if (reminderIsSet) {
      const keyVerificationReminder = getKeyVerificationReminder()
      setShowReminder(keyVerificationReminder)
    }
  }
  useEffect(() => {
    checkReminder()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          Manage master key
        </MediumText>
        <PrimaryButton
          style={styles.buttonFirstStyle}
          title="Reveal Master Key"
          onPress={revealMasterKey}
          accessibilityLabel="reveal"
        />
        {showReminder && (
          <SecondaryButton
            style={styles.buttonFirstStyle}
            title="Confirm Master Key"
            accessibilityLabel="confirm"
            onPress={() =>
              navigation.navigate(rootTabsRouteNames.CreateKeysUX, {
                screen: createKeysRouteNames.SecurityExplanation,
              })
            }
          />
        )}
        <SecondaryButton
          style={styles.buttonFirstStyle}
          title="Delete Master Key"
          onPress={handleDeleteKeys}
          accessibilityLabel="delete"
        />
      </View>
      <View style={styles.pinContainer}>
        <MediumText style={[styles.pinText, styles.textLeftMargin]}>
          Manage PIN
        </MediumText>
        <SecondaryButton
          style={styles.buttonFirstStyle}
          title="Change PIN"
          accessibilityLabel="change"
          onPress={changePin}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  textLeftMargin: {
    marginLeft: 10,
  },
  masterText: {
    marginBottom: 8,
  },
  pinContainer: {
    marginTop: 30,
  },
  pinText: {
    marginBottom: 8,
  },
  buttonFirstStyle: {
    width: undefined,
    marginHorizontal: undefined,
    marginBottom: 20,
  },
})
