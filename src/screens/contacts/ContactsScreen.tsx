import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
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
import { DeleteModal } from './DeleteModal'

export const ContactsScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { t } = useTranslation()
  const { contacts, deleteContact } = useContext(ContactsContext)
  const [filteredContacts, setFilteredContacts] = useState(contacts)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null)

  const showModal = (contact: IContact) => {
    setIsModalVisible(true)
    setSelectedContact(contact)
  }

  const hideModal = () => {
    setIsModalVisible(false)
    setSelectedContact(null)
  }

  const searchContact = (text: string) => {
    let filtered = contacts
    if (text) {
      filtered = contacts.filter(
        contact =>
          contact.name.toLowerCase().includes(text.toLowerCase()) ||
          contact.displayAddress.toLowerCase().includes(text.toLowerCase()),
      )
    }
    setFilteredContacts(filtered)
  }

  const editContact = (contact: IContact) => {
    navigation.navigate(
      'ContactForm' as never,
      { initialValue: contact } as never,
    )
  }

  const sendContact = (contact: IContact) => {
    navigation.navigate('Send' as never, { to: contact.address } as never)
  }

  const removeContact = (contact: IContact) => {
    deleteContact(contact.id)
    hideModal()
  }

  useEffect(() => {
    setFilteredContacts(contacts)
    setSelectedIndex(null)
  }, [contacts])

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <Icon.Button
          testID="addContact"
          name="user-plus"
          onPress={() => navigation.navigate('ContactForm' as never)}
          backgroundColor={colors.background.bustyBlue}
          iconStyle={styles.addButton}
          size={15}
          borderRadius={20}
        />
      </View>
      {selectedContact && (
        <DeleteModal
          isVisible={isModalVisible}
          text={`${t('Are you sure you want to delete')} ${
            selectedContact.name
          }?`}
          onOk={() => removeContact(selectedContact)}
          onCancel={hideModal}
        />
      )}
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
              testID="searchInput"
              style={styles.searchInput}
              placeholder={t('type to find...')}
              placeholderTextColor={colors.purple}
              onChangeText={searchContact}
            />
            <SearchIcon color={colors.purple} width={40} height={40} />
          </View>
          {filteredContacts
            .sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
            )
            .map((contact, index) => (
              <TouchableOpacity
                testID={`contactCard-${index}`}
                key={index}
                onPress={() =>
                  setSelectedIndex(selectedIndex === index ? null : index)
                }>
                <ContactRow
                  index={index}
                  contact={contact}
                  onSend={sendContact}
                  onDelete={showModal}
                  onEdit={editContact}
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
