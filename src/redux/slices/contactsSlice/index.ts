import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  ContactsState,
  SaveContactPayload,
} from 'store/slices/contactsSlice/types'
import { getContacts, saveContacts } from 'storage/MainStorage'
import { Contact } from 'shared/types'
import { defaultContacts } from 'store/slices/contactsSlice/constants'
import { TESTNET as addresses } from 'screens/rnsManager/addresses.json'

const initialState: ContactsState = {
  contacts: defaultContacts,
  recentContacts: [],
  selectedContact: null,
}

export const fetchContactsFromStorage = createAction('fetchContactsFromStorage')

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, { payload }: PayloadAction<SaveContactPayload>) => {
      state.contacts[payload.address] = { ...payload, isEditable: true }
      saveContacts(state.contacts)
      return state
    },
    editContact: (state, { payload }: PayloadAction<Contact>) => {
      state.contacts[payload.address] = { ...payload, isEditable: true }
      saveContacts(state.contacts)
      return state
    },
    deleteContactByAddress: (state, { payload }: PayloadAction<string>) => {
      delete state.contacts[payload]
      saveContacts(state.contacts)
      const indexOfContact = state.recentContacts.findIndex(
        c => c.address === payload,
      )
      state.recentContacts.splice(indexOfContact, 1)
      return state
    },
    deleteContacts: () => {
      return initialState
    },
    setSelectedContactByAddress: (
      state,
      { payload }: PayloadAction<string | null>,
    ) => {
      state.selectedContact = payload ? state.contacts[payload] : null
      return state
    },
    addRecentContact: (state, { payload }: PayloadAction<string>) => {
      if (
        addresses.fifsAddrRegistrarAddress.toLowerCase() ===
        payload.toLowerCase()
      ) {
        return
      }

      const addressForSearch = payload.toLowerCase()

      if (!state.recentContacts) {
        state.recentContacts = []
      }
      const indexOfContact = state.recentContacts.findIndex(
        c => c.address === addressForSearch,
      )
      if (indexOfContact === 0) {
        return
      }

      if (indexOfContact !== -1) {
        const recentContactRemoved = state.recentContacts.splice(
          indexOfContact,
          1,
        )[0]
        state.recentContacts.unshift(recentContactRemoved)
        return
      }
      const contact = Object.values(state.contacts).find(
        c => c.address === addressForSearch,
      )

      if (contact) {
        state.recentContacts.unshift(contact)
      }

      if (state.recentContacts.length > 10) {
        state.recentContacts.pop()
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchContactsFromStorage, state => {
      state.contacts = getContacts() ?? {}
      return state
    })
  },
})

export const {
  addContact,
  setSelectedContactByAddress,
  deleteContactByAddress,
  deleteContacts,
  editContact,
  addRecentContact,
} = contactsSlice.actions

export const contactsReducer = contactsSlice.reducer

export * from './selectors'
