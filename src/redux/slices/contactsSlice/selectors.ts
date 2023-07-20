import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'src/redux'

export const getContactsState = (state: RootState) => state.contacts

export const getContactsAsObject = createSelector(
  [getContactsState],
  contactsState => contactsState.contacts,
)

export const getContactsAsArray = createSelector(
  [getContactsAsObject],
  contacts => Object.values(contacts),
)
/**
 * To fetch only contacts that can be edited
 */
export const filteredContactsByEditable = createSelector(
  getContactsAsArray,
  contacts => contacts.filter(contact => contact.isEditable),
)
export const getContactsAsArrayAndSelected = createSelector(
  [filteredContactsByEditable, getContactsState],
  (contacts, { selectedContact }) => ({
    contacts,
    selectedContact,
  }),
)

export const getContactByAddress = (address: string) =>
  createSelector(
    [getContactsState],
    contactsState => contactsState.contacts[address],
  )

export const selectRecentContacts = ({ contacts }: RootState) =>
  contacts.recentContacts
