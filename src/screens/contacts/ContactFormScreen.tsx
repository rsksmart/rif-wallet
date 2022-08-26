import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { AddressInput } from '../../components'
import { BlueButton } from '../../components/button/ButtonVariations'
import { NavigationProp, ScreenProps } from '../../RootNavigation'
import { colors, grid } from '../../styles'
import { fonts } from '../../styles/fonts'
import { setOpacity } from '../home/tokenColor'
import { ContactsContext, IContact } from './ContactsContext'

interface ContactFormScreenProps {
  chainId: number
  navigation: NavigationProp
}

export const ContactFormScreen: React.FC<
  ContactFormScreenProps & ScreenProps<'Contacts'>
> = ({ navigation, chainId, route }) => {
  const initialValue = (route.params?.['initialValue'] ?? {
    name: '',
    address: '',
  }) as IContact

  const { addContact, editContact } = useContext(ContactsContext)
  const [name, setName] = useState(initialValue.name)
  const [address, setAddress] = useState({
    value: initialValue.address,
    isValid: !!initialValue.address,
  })
  const isValidContact = name && address.isValid

  const handleAddressChange = (value: string, isValid: boolean) => {
    setAddress({ value, isValid })
  }

  const saveContact = () => {
    if (initialValue.id) {
      const contact = {
        ...initialValue,
        name,
        address: address.value,
        displayAddress: address.value,
      }
      editContact(contact)
    } else {
      addContact(name, address.value, address.value)
    }
    navigation.navigate('ContactsList' as never)
  }

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <Icon.Button
          testID="backButton"
          name="arrow-back"
          onPress={() => navigation.navigate('ContactsList' as never)}
          backgroundColor={colors.background.primary}
          color={colors.lightPurple}
          style={styles.backButton}
          size={15}
          borderRadius={20}
        />
        <Text style={styles.title}>
          {initialValue.id ? 'Edit Contact' : 'Create Contact'}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>name</Text>
        <TextInput
          testID="nameInput"
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="name your contact..."
          placeholderTextColor={colors.text.secondary}
        />
        <View style={grid.row}>
          {/* <Text style={styles.disabledLabel}>alias</Text> */}
          <Text style={styles.label}>address</Text>
        </View>
        <AddressInput
          testID="addressInput"
          initialValue={initialValue.address}
          onChangeText={handleAddressChange}
          chainId={chainId}
          backgroundColor={colors.darkPurple4}
        />
      </View>
      <View style={styles.footer}>
        <BlueButton
          testID="saveButton"
          title="Save Contact"
          onPress={saveContact}
          style={styles.saveButton}
          disabled={!isValidContact}
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
