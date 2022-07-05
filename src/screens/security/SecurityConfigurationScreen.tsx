import React from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { colors } from '../../styles'
import { MediumText } from '../../components'
import { ScreenProps } from '../../RootNavigation'
import { useTranslation } from 'react-i18next'
import ActiveButton from '../../components/button/ActiveButton'

export type SecurityScreenProps = {
  deleteKeys: () => Promise<any>
}
const SecurityConfigurationScreen: React.FC<
  ScreenProps<'SecurityConfigurationScreen'> & SecurityScreenProps
> = ({ navigation, deleteKeys }) => {
  const { t } = useTranslation()

  const revealMasterKey = () => navigation.navigate('KeysInfo' as any)
  const changePin = () => navigation.navigate('ChangePinScreen' as any)

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
          onPress: () =>
            deleteKeys().then(() => navigation.navigate('CreateKeysUX' as any)),
        },
      ],
    )
  }

  return (
    <View style={styles.container}>
      <View>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          Manage master key
        </MediumText>
        <ActiveButton
          style={styles.buttonFirstStyle}
          text="Reveal Master Key"
          isActive
          onPress={revealMasterKey}
        />
        <ActiveButton
          style={styles.buttonFirstStyle}
          text="Delete Master Key"
          onPress={handleDeleteKeys}
        />
      </View>
      <View style={styles.pinContainer}>
        <MediumText style={[styles.pinText, styles.textLeftMargin]}>
          Manage PIN
        </MediumText>
        <ActiveButton
          style={styles.buttonFirstStyle}
          text="Change PIN"
          isActive
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

export default SecurityConfigurationScreen
