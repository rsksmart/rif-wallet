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

export const getContactsAsArrayAndSelected = createSelector(
  [getContactsAsArray, getContactsState],
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
