import { View, StyleSheet } from 'react-native'
import { RegularText } from '../../components'
import { colors } from '../../styles'
import { ActiveButton } from '../../components/button'

export const ChangeLanguageScreen = () => {
  // @TODO logic to implement language change and mode change...
  return (
    <View style={styles.container}>
      <View>
        <RegularText style={styles.label}>Select language</RegularText>
        <View style={styles.languageView}>
          <ActiveButton isActive title="ENG" accessibilityLabel="English" />
          <ActiveButton title="ESP" accessibilityLabel="Spanish" />
        </View>
      </View>
      <View style={styles.modeView}>
        <RegularText style={styles.label}>Mode</RegularText>
        <View style={styles.languageView}>
          <ActiveButton
            isActive
            title="dark mode"
            accessibilityLabel="dark mode"
          />
          <ActiveButton title="light mode" accessibilityLabel="light mode" />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  label: {
    color: colors.lightPurple,
  },
  languageView: {
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'center',
  },
  modeView: {
    marginTop: 25,
  },
})
