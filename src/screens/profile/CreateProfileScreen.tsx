import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { colors } from '../../styles'
import { MediumText, RegularText } from '../../components'
import PrimaryButton from '../../components/button/PrimaryButton'

export const CreateProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          alias
        </MediumText>
        <PrimaryButton style={styles.buttonFirstStyle}>
          <View>
            <RegularText>deploy wallet</RegularText>
          </View>
        </PrimaryButton>
      </View>
      <View style={styles.rowContainer}>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          phone
        </MediumText>

        <TextInput
          style={styles.input}
          onChangeText={() => {}}
          value={''}
          placeholder="0.00"
          keyboardType="numeric"
          testID={'Amount.Input'}
          placeholderTextColor={colors.gray}
        />
      </View>
      <View style={styles.rowContainer}>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          email
        </MediumText>
        <TextInput
          style={styles.input}
          onChangeText={() => {}}
          value={''}
          placeholder="0.00"
          keyboardType="numeric"
          testID={'Amount.Input'}
          placeholderTextColor={colors.gray}
        />
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
  input: {
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 20,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    padding: 22,
  },
  textLeftMargin: {
    marginLeft: 10,
  },
  masterText: {
    marginBottom: 8,
    color: colors.white,
  },
  rowContainer: {
    marginTop: 30,
  },
  buttonFirstStyle: {
    color: colors.lightGray,
    width: undefined,
    marginHorizontal: undefined,
    marginBottom: 20,
    backgroundColor: colors.lightGray,
  },
})
