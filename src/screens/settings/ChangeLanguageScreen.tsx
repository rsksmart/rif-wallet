import React from 'react'
import { View, StyleSheet } from 'react-native'
import { RegularText } from '../../components'
import { colors } from '../../styles'
import ActiveButton from '../../components/button/ActiveButton'

export const ChangeLanguageScreen = () => {
  // @TODO logic to implement language change and mode change...
  return (
    <View style={styles.container}>
      <View>
        <RegularText>Select language</RegularText>
        <View style={styles.languageView}>
          <ActiveButton text="ENG" />
          <ActiveButton text="ESP" />
        </View>
      </View>
      <View style={styles.modeView}>
        <RegularText>Mode</RegularText>
        <View style={styles.languageView}>
          <ActiveButton text="dark mode" />
          <ActiveButton text="light mode" />
        </View>
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
  languageView: {
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'center',
  },
  modeView: {
    marginTop: 25,
  },
})
