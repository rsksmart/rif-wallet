import { useMemo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { SearchIcon } from 'components/icons/SearchIcon'
import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import { ContactRow } from './ContactRow'
import { Contact } from 'store/slices/contactsSlice/types'
import { CompositeScreenProps } from '@react-navigation/native'
import { ContactsStackScreenProps } from '..'
import { contactsStackRouteNames } from 'src/navigation/contactsNavigator'
import { selectBalances } from 'src/redux/slices/balancesSlice/selectors'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { getContactsAsArrayAndSelected } from 'store/slices/contactsSlice/selectors'
import {
  deleteContactById,
  setSelectedContactById,
} from 'store/slices/contactsSlice/contactsSlice'

export type ContactsListScreenProps = CompositeScreenProps<
  ContactsStackScreenProps<contactsStackRouteNames.ContactsList>,
  RootStackScreenProps<rootStackRouteNames.Contacts>
>

export const ContactsScreen = ({ navigation }: ContactsListScreenProps) => {
  const { t } = useTranslation()
  const { contacts, selectedContact } = useAppSelector(
    getContactsAsArrayAndSelected,
  )
  const dispatch = useAppDispatch()

  const [searchContactText, setSearchContactText] = useState('')

  const contactsFiltered = useMemo(() => {
    let filtered = contacts
    if (searchContactText) {
      filtered = contacts.filter(
        contact =>
          contact.name
            .toLowerCase()
            .includes(searchContactText.toLowerCase()) ||
          contact.displayAddress
            .toLowerCase()
            .includes(searchContactText.toLowerCase()),
      )
    }
    return filtered.sort(({ name: a }, { name: b }) => a.localeCompare(b))
  }, [contacts, searchContactText])

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const [isDeleteContactModalVisible, setIsDeleteContactModalVisible] =
    useState(false)

  const tokenBalances = useAppSelector(selectBalances)
  const shouldHideSendButton = Object.values(tokenBalances).length === 0

  const showModal = (contact: Contact) => {
    setIsDeleteContactModalVisible(true)
    dispatch(setSelectedContactById(contact.id))
  }

  const hideModal = () => {
    setIsDeleteContactModalVisible(false)
    dispatch(setSelectedContactById(null))
  }

  const editContact = (contact: Contact) => {
    navigation.navigate(contactsStackRouteNames.ContactForm, {
      initialValue: contact,
    })
  }

  const sendContact = (contact: Contact) => {
    navigation.navigate(rootStackRouteNames.Send, { to: contact.address })
  }

  const removeContact = () => {
    if (selectedContact) {
      dispatch(deleteContactById(selectedContact.id))
    }
    hideModal()
  }
  // Everytime contact is reloaded, set index back to null
  useEffect(() => {
    setSelectedIndex(null)
  }, [contacts])

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <Icon.Button
          accessibilityLabel="addContact"
          name="user-plus"
          onPress={() =>
            navigation.navigate(contactsStackRouteNames.ContactForm)
          }
          backgroundColor={colors.background.bustyBlue}
          iconStyle={styles.addButton}
          size={15}
          borderRadius={20}
        />
      </View>
      {selectedContact && (
        <ConfirmationModal
          isVisible={isDeleteContactModalVisible}
          imgSrc={require('../../images/contact-trash.png')}
          title={`${t('Are you sure you want to delete')} ${
            selectedContact.name
          }?`}
          okText={t('Delete')}
          cancelText={t('Cancel')}
          onOk={removeContact}
          onCancel={hideModal}
        />
      )}
      {contacts.length === 0 ? (
        <>
          <Image
            source={require('../../images/empty-contact.png')}
            style={styles.noContactsImage}
          />
          <View style={styles.noContactsTextView} testID="emptyView">
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
              accessibilityLabel="searchInput"
              style={styles.searchInput}
              placeholder={t('type to find...')}
              placeholderTextColor={colors.purple}
              onChangeText={setSearchContactText}
            />
            <SearchIcon color={colors.purple} width={40} height={40} />
          </View>
          {contactsFiltered.map((contact, index) => (
            <ContactRow
              key={index}
              index={index}
              contact={contact}
              selected={selectedIndex === index}
              onSend={sendContact}
              onDelete={showModal}
              onEdit={editContact}
              onPress={() =>
                setSelectedIndex(selectedIndex === index ? null : index)
              }
              hideSendButton={shouldHideSendButton}
            />
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
