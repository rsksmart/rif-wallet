import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Image } from 'react-native'
import { colors } from '../../styles'
import { MediumText } from '../../components'
import { PurpleButton } from '../../components/button/ButtonVariations'

export const CreateProfileScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>()
  const [email, setEmail] = useState<string>()
  return (
    <View style={styles.container}>
      <MediumText style={styles.titleText}>create profile</MediumText>
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={require('../../images/image_place_holder.jpeg')}
        />
      </View>

      <View style={styles.rowContainer}>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          alias
        </MediumText>
        <PurpleButton
          onPress={() => {}}
          accessibilityLabel="importWallet"
          title={'register new'}
        />
      </View>
      <View style={styles.rowContainer}>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          phone
        </MediumText>

        <TextInput
          style={styles.input}
          onChangeText={setPhoneNumber}
          value={phoneNumber}
          placeholder=""
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
          onChangeText={setEmail}
          value={email}
          placeholder=""
          keyboardType="numeric"
          testID={'Amount.Input'}
          placeholderTextColor={colors.gray}
        />
      </View>
      <View style={styles.rowContainer}>
        <PurpleButton
          onPress={() => {}}
          accessibilityLabel="create"
          title={'create'}
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
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  input: {
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    padding: 14,
  },
  textLeftMargin: {
    marginLeft: 10,
  },
  titleText: {
    alignSelf: 'center',
    marginBottom: 12,
    color: colors.white,
  },
  masterText: {
    marginBottom: 0,
    color: colors.white,
  },
  rowContainer: {
    marginTop: 30,
  },
  buttonFirstStyle: {
    width: undefined,
    marginHorizontal: undefined,
    marginBottom: 20,
    backgroundColor: colors.blue,
  },
})
