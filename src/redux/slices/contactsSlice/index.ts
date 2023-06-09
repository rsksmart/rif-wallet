import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  ContactsState,
  SaveContactPayload,
} from 'store/slices/contactsSlice/types'
import {
  getContacts,
  saveContacts,
  deleteContacts as deleteContactsFromStorage,
} from 'storage/MainStorage'
import { Contact } from 'shared/types'
import { defaultContacts } from 'store/slices/contactsSlice/constants'

const initialState: ContactsState = {
  contacts: defaultContacts,
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
      return state
    },
    deleteContacts: () => {
      deleteContactsFromStorage()
      return initialState
    },
    setSelectedContactByAddress: (
      state,
      { payload }: PayloadAction<string | null>,
    ) => {
      state.selectedContact = payload ? state.contacts[payload] : null
      return state
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
} = contactsSlice.actions

export const contactsReducer = contactsSlice.reducer

export * from './selectors'
