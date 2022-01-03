import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native'
import { NavigationProp } from '../../RootNavigation'
import LinearGradient from 'react-native-linear-gradient'
import { setOpacity } from '../home/tokenColor'
import { Button } from '../../components'
import { ContactsContext } from './ContactsContext'

export const EditContactScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const [name, setName] = useState('')
  const [addressOrUrl, setAddressOrUrl] = useState('')

  const { addContact } = useContext(ContactsContext)

  return (
    <LinearGradient
      colors={['#FFFFFF', setOpacity('#CCCCCC', 0.1)]}
      style={styles.parent}>
      <Text style={styles.header}>Add/Edit Contact</Text>

      <ScrollView style={styles.contacts}>
        <TextInput
          onChangeText={text => setName(text)}
          value={name}
          placeholder={'Contact name'}
          style={styles.input}
        />
        <TextInput
          onChangeText={text => setAddressOrUrl(text)}
          value={addressOrUrl}
          placeholder={'Contact address / RNS url'}
          style={styles.input}
        />
        <Button
          onPress={() => {
            addContact(name, addressOrUrl)
            navigation.goBack()
          }}
          title="Save"
          style={{ margin: 12 }}
          disabled={name && addressOrUrl ? false : true}
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
