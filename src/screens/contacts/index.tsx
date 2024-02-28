import { useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { CompositeScreenProps, useIsFocused } from '@react-navigation/native'
import { FormProvider, useForm } from 'react-hook-form'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { shortAddress } from 'lib/utils'

import {
  AppButton,
  AppTouchable,
  Typography,
  buttonHeight,
} from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { contactsStackRouteNames } from 'navigation/contactsNavigator'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import {
  getContactsAsArrayAndSelected,
  selectRecentContacts,
} from 'store/slices/contactsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { changeTopColor } from 'store/slices/settingsSlice'
import { Search } from 'components/input/search'
import { BasicRow } from 'components/BasicRow'
import { sharedColors, sharedStyles, testIDs } from 'shared/constants'
import { Contact } from 'shared/types'
import { castStyle } from 'shared/utils'

import { ContactsStackScreenProps } from '../index'
import { ContactCard } from './components/ContactCard'

export type ContactsListScreenProps = CompositeScreenProps<
  ContactsStackScreenProps<contactsStackRouteNames.ContactsList>,
  RootTabsScreenProps<rootTabsRouteNames.Contacts>
>

export const ContactsScreen = ({ navigation }: ContactsListScreenProps) => {
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  })
  const { resetField, watch } = methods
  const { t } = useTranslation()
  const { contacts } = useAppSelector(getContactsAsArrayAndSelected)
  const recentContacts = useAppSelector(selectRecentContacts)

  const searchContactText = watch('search')

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

  const onSearchReset = useCallback(() => {
    resetField('search')
  }, [resetField])

  const onSendToRecentContact = useCallback(
    (contact: Contact) => () => {
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Send,
        params: { contact, backScreen: contactsStackRouteNames.ContactsList },
      })
    },
    [navigation],
  )

  useEffect(() => {
    if (isFocused) {
      dispatch(changeTopColor(sharedColors.background.primary))
    }
  }, [dispatch, isFocused])

  return (
    <View style={sharedStyles.screen}>
      <Typography type={'h2'} style={styles.title}>
        {t('contacts_screen_title')}
      </Typography>
      {recentContacts?.length > 0 && (
        <View style={styles.recentContacts}>
          <ScrollView horizontal>
            {recentContacts.map((c, i) => (
              <ContactCard
                key={i}
                name={c.name}
                onPress={onSendToRecentContact(c)}
              />
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.subtitle} testID={'emptyView'}>
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
              accessibilityLabel={testIDs.searchInput}
            />
            <ScrollView
              style={styles.contactsList}
              contentContainerStyle={{
                paddingBottom: insets.bottom + buttonHeight + 12,
              }}>
              {contactsFiltered.map((contact, index) => (
                <AppTouchable
                  key={index + contact.name}
                  accessibilityLabel={contact.name}
                  width={'100%'}
                  onPress={() =>
                    navigation.navigate(
                      contactsStackRouteNames.ContactDetails,
                      {
                        contact,
                      },
                    )
                  }>
                  <BasicRow
                    style={{ backgroundColor: sharedColors.background.primary }}
                    avatar={{ name: contact.name }}
                    label={contact.name}
                    secondaryLabel={
                      contact.displayAddress.length > 0
                        ? contact.displayAddress
                        : shortAddress(contact.address)
                    }
                  />
                </AppTouchable>
              ))}
            </ScrollView>
          </>
        )}
      </FormProvider>
      <AppButton
        title={t('contacts_new_contact_button_label')}
        accessibilityLabel={testIDs.newContact}
        onPress={() => navigation.navigate(contactsStackRouteNames.ContactForm)}
        style={styles.newContactButton}
        color={sharedColors.button.primaryBackground}
        textColor={sharedColors.button.primaryText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({
    marginTop: 18,
  }),
  noContactsImage: castStyle.image({
    marginTop: 102,
    alignSelf: 'center',
  }),
  searchInput: castStyle.view({
    marginTop: 14,
  }),
  subtitle: castStyle.view({
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  }),
  contactsList: castStyle.view({
    marginTop: 14,
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  }),
  newContactButton: castStyle.view({
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  }),
  recentContacts: castStyle.view({
    height: 100,
    marginTop: 12,
  }),
})

export * from './ContactDetails'
