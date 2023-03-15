import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { CompositeScreenProps } from '@react-navigation/native'
import { FormProvider, useForm } from 'react-hook-form'

// import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import { AppButton, Typography } from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
// import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { contactsStackRouteNames } from 'navigation/contactsNavigator'
// import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { getContactsAsArrayAndSelected } from 'store/slices/contactsSlice'
import { useAppSelector } from 'store/storeUtils'
import { Search } from 'components/input/search'
import { BasicRow } from 'components/BasicRow'
import { sharedColors, sharedStyles, testIDs } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { ContactsStackScreenProps } from '../index'

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
  const { resetField, watch } = methods
  const { t } = useTranslation()
  const { contacts } = useAppSelector(getContactsAsArrayAndSelected)
  // const dispatch = useAppDispatch()

  const searchString = watch('search')

  const contactsFiltered = useMemo(() => {
    let filtered = contacts
    if (searchString) {
      filtered = contacts.filter(
        contact =>
          contact.name.toLowerCase().includes(searchString.toLowerCase()) ||
          contact.displayAddress
            .toLowerCase()
            .includes(searchString.toLowerCase()),
      )
    }
    return filtered.sort(({ name: a }, { name: b }) => a.localeCompare(b))
  }, [contacts, searchString])

  const onSearchReset = useCallback(() => {
    resetField('search')
  }, [resetField])

  // const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // const [isDeleteContactModalVisible, setIsDeleteContactModalVisible] =
  //   useState(false)

  // const tokenBalances = useAppSelector(selectBalances)

  // const hideModal = useCallback(() => {
  //   setIsDeleteContactModalVisible(false)
  //   dispatch(setSelectedContactById(null))
  // }, [dispatch])

  // const editContact = useCallback(
  //   (contact: Contact) => {
  //     navigation.navigate(contactsStackRouteNames.ContactForm, {
  //       initialValue: contact,
  //     })
  //   },
  //   [navigation],
  // )

  // const sendContact = useCallback(
  //   (contact: Contact) => {
  //     navigation.navigate(rootTabsRouteNames.Home, {
  //       screen: homeStackRouteNames.Send,
  //       params: { to: contact.address },
  //     })
  //   },
  //   [navigation],
  // )

  // const removeContact = useCallback(() => {
  //   if (selectedContact) {
  //     dispatch(deleteContactById(selectedContact.id))
  //   }
  //   hideModal()
  // }, [dispatch, hideModal, selectedContact])

  // Everytime contact is reloaded, set index back to null
  // useEffect(() => {
  //   setSelectedIndex(null)
  // }, [contacts])

  return (
    <View style={sharedStyles.screen}>
      <Typography type={'h2'} style={styles.title}>
        {t('contacts_screen_title')}
      </Typography>
      <View style={styles.noContactsTextView} testID={'emptyView'}>
        {contacts.length === 0 ? (
          <>
            <Typography type={'body3'}>{t('contacts_empty_list')}</Typography>
            <Typography type={'body3'}>{t('contacts_empty_start')}</Typography>
          </>
        ) : (
          <Typography type={'body3'}>{t('contacts_browse')}</Typography>
        )}
      </View>
      <FormProvider {...methods}>
        {/* {selectedContact && (
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
        )} */}
        {contacts.length === 0 ? (
          <Image
            source={require('assets/images/contacts_empty.png')}
            style={styles.noContactsImage}
          />
        ) : (
          <>
            <Search
              label={t('contacts_search_label')}
              containerStyle={styles.searchInput}
              inputName={'search'}
              resetValue={onSearchReset}
              placeholder={t('search_placeholder')}
              testID={testIDs.searchInput}
            />
            <ScrollView style={styles.contactsList}>
              {contactsFiltered.map((contact, index) => (
                <BasicRow
                  key={index + contact.name}
                  style={{ backgroundColor: sharedColors.black }}
                  avatar={{ name: contact.name }}
                  label={contact.name}
                  secondaryLabel={contact.displayAddress}
                />
              ))}
            </ScrollView>
          </>
        )}
      </FormProvider>
      <AppButton
        title={t('contacts_new_contact_button_label')}
        onPress={() => navigation.navigate(contactsStackRouteNames.ContactForm)}
        style={styles.newContactButton}
        textColor={sharedColors.black}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({ marginTop: 44 }),
  noContactsImage: castStyle.image({
    marginTop: 102,
    alignSelf: 'center',
  }),
  searchInput: castStyle.view({
    marginTop: 18,
  }),
  noContactsTextView: castStyle.view({
    marginTop: 14,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  }),
  contactsList: {
    marginTop: 18,
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  newContactButton: castStyle.view({
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    height: 52,
    backgroundColor: sharedColors.white,
  }),
})
