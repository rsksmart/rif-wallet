import React, { useContext, useState } from 'react'
import { StyleSheet, Text, TextInput } from 'react-native'
import { NavigationProp } from '../../RootNavigation'
import LinearGradient from 'react-native-linear-gradient'
import { setOpacity } from '../home/tokenColor'
import { AddressInput, Button } from '../../components'
import { ContactsContext } from './ContactsContext'

export type EditContactScreenProps = {}

export const EditContactScreen: React.FC<
  {
    navigation: NavigationProp
  } & EditContactScreenProps
> = ({ navigation }) => {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  const { addContact } = useContext(ContactsContext)

  const handleTargetAddressChange = (addressParam: string) => {
    setAddress(addressParam)
  }

  const isValid = address && name

  return (
    <LinearGradient
      colors={['#FFFFFF', setOpacity('#CCCCCC', 0.1)]}
      style={styles.parent}>
      <Text style={styles.header}>Add Contact</Text>
      <TextInput
        onChangeText={text => setName(text)}
        value={name}
        placeholder={'Contact name'}
        style={styles.input}
      />
      <AddressInput
        initialValue={address}
        onChangeText={handleTargetAddressChange}
        showContactsIcon={false}
        testID="Input.Address"
        chainId={31}
      />
      <Button
        onPress={() => {
          addContact(name, address, address)
          navigation.goBack()
        }}
        title="Save"
        style={styles.saveButton}
        disabled={!isValid}
      />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
  parent: {
    height: '100%',
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
  },
  label: {
    fontWeight: '600',
  },
  input: {
    margin: 12,
    borderWidth: 4,
    borderColor: '#e6e6e6',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
  },
  saveButton: {
    margin: 12,
  },
})
