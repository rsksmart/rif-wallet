import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { AddressInput } from '../../components'
import { BlueButton } from '../../components/button/ButtonVariations'
import { ScreenProps } from '../../RootNavigation'
import { colors, grid } from '../../styles'
import { fonts } from '../../styles/fonts'
import { setOpacity } from '../home/tokenColor'
import { IContact } from './ContactsContext'

interface ContactFormScreenProps {
  chainId: number
}

export const ContactFormScreen: React.FC<
  ContactFormScreenProps & ScreenProps<'Contacts'>
> = ({ navigation, chainId, route }) => {
  const initialValue = (route.params?.['initialValue'] ?? {
    name: '',
    address: '',
  }) as IContact

  const [name, setName] = React.useState(initialValue.name)
  const [address, setAddress] = React.useState({
    value: initialValue.address,
    isValid: !!initialValue.address,
  })
  const isValidContact = name && address.isValid

  const handleAddressChange = (value: string, isValid: boolean) => {
    setAddress({ value, isValid })
  }

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
          testID="backButton"
        />
        <Text style={styles.title}>Create Contact</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="name your contact..."
          placeholderTextColor={colors.text.secondary}
          testID="nameInput"
        />
        <View style={grid.row}>
          {/* <Text style={styles.disabledLabel}>alias</Text> */}
          <Text style={styles.label}>address</Text>
        </View>
        <AddressInput
          initialValue={initialValue.address}
          onChangeText={handleAddressChange}
          chainId={chainId}
          testID="addressInput"
          backgroundColor={colors.darkPurple4}
        />
      </View>
      <View style={styles.footer}>
        <BlueButton
          title="Save Contact"
          onPress={() => {}}
          style={styles.saveButton}
          disabled={!isValidContact}
          testID="saveButton"
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
