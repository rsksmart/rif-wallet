import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native'
import { NavigationProp } from '../../RootNavigation'
import LinearGradient from 'react-native-linear-gradient'
import { setOpacity } from '../home/tokenColor'
import { AddressInput, Button } from '../../components'
import { ContactsContext } from './ContactsContext'
import Resolver from '@rsksmart/rns-resolver.js'

export type EditContactScreenProps = {
  rnsResolver: Resolver
}

export const EditContactScreen: React.FC<
  {
    navigation: NavigationProp
  } & EditContactScreenProps
> = ({ navigation, rnsResolver }) => {
  const [name, setName] = useState('')
  const [isValidAddressOrUrl, setIsValidAddressOrUrl] = useState(false)
  const [addressOrUrl, setAddressOrUrl] = useState('')

  const { addContact } = useContext(ContactsContext)

  const handleTargetAddressChange = (
    isValid: boolean,
    address: string,
    displayAddress: string,
  ) => {
    setIsValidAddressOrUrl(isValid)
    setAddressOrUrl(displayAddress)
  }

  const isValid = isValidAddressOrUrl && name ? true : false

  return (
    <LinearGradient
      colors={['#FFFFFF', setOpacity('#CCCCCC', 0.1)]}
      style={styles.parent}>
      <Text style={styles.header}>Add Contact</Text>

      <ScrollView style={styles.contacts}>
        <TextInput
          onChangeText={text => setName(text)}
          value={name}
          placeholder={'Contact name'}
          style={styles.input}
        />
        <AddressInput
          onChangeText={handleTargetAddressChange}
          value={addressOrUrl}
          placeholder={'Contact address / RNS url'}
          testID={'AddressOrUrl.Input'}
          rnsResolver={rnsResolver}
          style={styles.input}
        />
        {/* <TextInput
          onChangeText={text => setAddressOrUrl(text)}
          value={addressOrUrl}
          placeholder={'Contact address / RNS url'}
          style={styles.input}
        /> */}
        <Button
          onPress={() => {
            addContact(name, addressOrUrl)
            navigation.goBack()
          }}
          title="Save"
          style={{ margin: 12 }}
          disabled={!isValid}
        />
      </ScrollView>
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
  contacts: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
})
