import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { NavigationProp } from '../../RootNavigation'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { ContactRow } from './ContactRow'
import { ContactsContext, IContact } from './ContactsContext'

export const ContactsScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { t } = useTranslation()
  const { contacts, deleteContact } = useContext(ContactsContext)
  const [filteredContacts, setFilteredContacts] = useState(contacts)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const searchContact = (text: string) => {
    let filtered = contacts
    if (text) {
      filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(text.toLowerCase()),
      )
    }
    setFilteredContacts(filtered)
  }

  const removalConfirmation = (contact: IContact) => {
    // TODO: improve this alert
    Alert.alert(
      'Delete contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Delete', onPress: () => deleteContact(contact.id) },
      ],
    )
  }

  const editContact = (contact: IContact) => {
    console.log('edit contact', contact)
  }

  const sendContact = (contact: IContact) => {
    console.log('send contact', contact)
  }

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <Icon.Button
          name="user-plus"
          onPress={() => navigation.navigate('ContactEdit' as never)}
          backgroundColor={colors.background.bustyBlue}
          iconStyle={styles.addButton}
          size={15}
          borderRadius={20}
        />
      </View>
      {contacts.length === 0 ? (
        <>
          <Image
            source={require('../../images/empty-contact.png')}
            style={styles.noContactsImage}
          />
          <View style={styles.noContactsTextView}>
            <Text style={styles.noContactsText}>
              {t('Your contact list is empty.')}
            </Text>
            <Text style={styles.noContactsText}>
              {t('Start by creating a new contact.')}
            </Text>
          </View>
        </>
      ) : (
        <ScrollView style={styles.contactsList}>
          <View style={styles.searchView}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('type to find...')}
              placeholderTextColor={colors.purple}
              onChangeText={searchContact}
            />
            <SearchIcon
              color={colors.purple}
              width={40}
              height={40}></SearchIcon>
          </View>
          {filteredContacts
            .sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
            )
            .map((contact, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  setSelectedIndex(selectedIndex === index ? null : index)
                }>
                <ContactRow
                  contact={contact}
                  onSend={() => sendContact(contact)}
                  onDelete={() => removalConfirmation(contact)}
                  onEdit={() => editContact(contact)}
                  selected={selectedIndex === index}
                />
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.background.darkBlue,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.text.primary,
  },
  addButton: {
    color: colors.lightPurple,
    padding: 3,
    marginRight: 0,
  },
  searchView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.darkBlue,
    borderWidth: 0.8,
    borderColor: colors.purple,
    borderRadius: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 5,
    fontSize: 14,
    color: colors.purple,
    fontFamily: fonts.regular,
    paddingLeft: 15,
  },
  noContactsImage: {
    flex: 4,
    alignSelf: 'center',
    width: '90%',
    resizeMode: 'contain',
  },
  noContactsTextView: {
    flex: 1,
    alignSelf: 'center',
  },
  noContactsText: {
    color: colors.text.primary,
    fontFamily: fonts.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  contactsList: {
    borderRadius: 20,
    marginTop: 10,
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
    flexWrap: 'wrap',
  },
})
