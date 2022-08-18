import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { BlueButton } from '../../components/button/ButtonVariations'
import { NavigationProp } from '../../RootNavigation'
import { colors, grid } from '../../styles'
import { fonts } from '../../styles/fonts'
import { setOpacity } from '../home/tokenColor'

interface ContactFormScreenProps {
  navigation: NavigationProp
}

export const ContactFormScreen: React.FC<ContactFormScreenProps> = ({
  navigation,
}) => {
  const [name, setName] = React.useState('')
  const [address, setAddress] = React.useState('')
  const isValidContact = name && address
  const isAddress = address.startsWith('0x')

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <Icon.Button
          name="arrow-back"
          onPress={() => navigation.navigate('ContactsList' as never)}
          backgroundColor={colors.background.primary}
          color={colors.lightPurple}
          style={styles.backButton}
          size={15}
          borderRadius={20}
          testID={'backButton'}
        />
        <Text style={styles.title}>Create Contact</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>name</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setName(text)}
          // value={input}
          placeholder="name your contact..."
          placeholderTextColor={colors.text.secondary}
          testID={'nameInput'}
        />
        <View style={grid.row}>
          <Text
            style={address && !isAddress ? styles.label : styles.disabledLabel}>
            alias
          </Text>
          <Text style={isAddress ? styles.label : styles.disabledLabel}>
            address
          </Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={text => setAddress(text)}
          // value={input}
          placeholder="paste or type the alias..."
          placeholderTextColor={colors.text.secondary}
          testID={'addressInput'}
        />
      </View>
      <View style={styles.footer}>
        <BlueButton
          title="Save Contact"
          onPress={() => {}}
          style={styles.saveButton}
          disabled={!isValidContact}
          testID={'saveButton'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    alignContent: 'space-around',
    height: '100%',
    backgroundColor: colors.background.darkBlue,
    padding: 20,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  backButton: {
    paddingRight: 0,
    alignSelf: 'center',
    color: colors.lightPurple,
  },
  title: {
    flex: 2,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    alignSelf: 'center',
  },
  body: {
    flex: 12,
    paddingTop: 50,
  },
  label: {
    color: colors.text.primary,
    padding: 10,
  },
  disabledLabel: {
    color: setOpacity(colors.text.primary, 0.4),
    padding: 10,
  },
  input: {
    color: colors.text.primary,
    fontFamily: fonts.regular,
    backgroundColor: colors.darkPurple4,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  footer: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  saveButton: {
    justifyContent: 'center',
    backgroundColor: colors.blue2,
    borderWidth: 0,
    borderRadius: 20,
    height: 50,
  },
})
