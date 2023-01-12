import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  ContactsState,
  SaveContactPayload,
} from 'store/slices/contactsSlice/types'
import { getContacts, saveContacts } from 'src/storage/MainStorage'
import { Contact } from 'store/slices/contactsSlice/types'
import uuid from 'react-native-uuid'

const initialState: ContactsState = {
  contacts: {},
  selectedContact: null,
}

export const fetchContactsFromStorage = createAction('fetchContactsFromStorage')

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, { payload }: PayloadAction<SaveContactPayload>) => {
      const id = uuid.v4() as string
      state.contacts[id] = { id, ...payload }
      saveContacts(state.contacts)
      return state
    },
    editContact: (state, { payload }: PayloadAction<Contact>) => {
      state.contacts[payload.id] = { ...payload }
      saveContacts(state.contacts)
      return state
    },
    deleteContactById: (state, { payload }: PayloadAction<string>) => {
      delete state.contacts[payload]
      saveContacts(state.contacts)
      return state
    },
    deleteContacts: () => {
      return initialState
    },
    setSelectedContactById: (
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
  setSelectedContactById,
  deleteContactById,
  deleteContacts,
  editContact,
} = contactsSlice.actions

export const contactsReducer = contactsSlice.reducer

export * from './selectors'
