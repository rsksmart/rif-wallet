import { useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { CompositeScreenProps } from '@react-navigation/native'
import { FormProvider, useForm } from 'react-hook-form'

import { SearchIcon } from 'components/icons/SearchIcon'
import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import { RegularText } from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { contactsStackRouteNames } from 'navigation/contactsNavigator'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import {
  deleteContactByAddress,
  getContactsAsArrayAndSelected,
  setSelectedContactByAddress,
} from 'store/slices/contactsSlice'
import { Contact } from 'shared/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { Search } from 'components/input/search'

import { ContactsStackScreenProps } from '../index'
import { ContactRow } from './ContactRow'

export type ContactsListScreenProps = CompositeScreenProps<
  ContactsStackScreenProps<contactsStackRouteNames.ContactsList>,
  RootTabsScreenProps<rootTabsRouteNames.Contacts>
>

export const ContactsScreen = ({ navigation }: ContactsListScreenProps) => {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  })
  const { resetField } = methods
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

  const showModal = useCallback(
    (contact: Contact) => {
      setIsDeleteContactModalVisible(true)
      dispatch(setSelectedContactByAddress(contact.address))
    },
    [setIsDeleteContactModalVisible, dispatch],
  )

  const hideModal = useCallback(() => {
    setIsDeleteContactModalVisible(false)
    dispatch(setSelectedContactByAddress(null))
  }, [setIsDeleteContactModalVisible, dispatch])

  const editContact = useCallback(
    (contact: Contact) => {
      navigation.navigate(contactsStackRouteNames.ContactForm, {
        initialValue: contact,
      })
    },
    [navigation],
  )
  const sendContact = useCallback(
    (contact: Contact) => {
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Send,
        params: { to: contact.address },
      })
    },
    [navigation],
  )
  const removeContact = useCallback(() => {
    if (selectedContact) {
      dispatch(deleteContactByAddress(selectedContact.address))
    }
    hideModal()
  }, [selectedContact, dispatch, hideModal])

  // Everytime contact is reloaded, set index back to null
  useEffect(() => {
    setSelectedIndex(null)
  }, [contacts])

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <RegularText style={styles.title}>Contacts</RegularText>
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
            <RegularText style={styles.noContactsText}>
              {t('Your contact list is empty.')}
            </RegularText>
            <RegularText style={styles.noContactsText}>
              {t('Start by creating a new contact.')}
            </RegularText>
          </View>
        </>
      ) : (
        <>
          <FormProvider {...methods}>
            <Search
              inputName={'search'}
              testID={'searchInput'}
              accessibilityLabel={'searchInput'}
              resetValue={() => resetField('search')}
              placeholder={t('search_placeholder')}
              onChangeText={setSearchContactText}
            />
          </FormProvider>
          <ScrollView style={styles.contactsList}>
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
        </>
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
