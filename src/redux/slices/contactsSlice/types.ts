import { Contact } from 'shared/types'

export interface ContactsState {
  contacts: Record<string, Contact>
  recentContacts: Contact[]
  selectedContact: Contact | null
}

export interface SaveContactPayload {
  name: string
  address: string
  displayAddress: string
}

export interface AddRecentContactAction {
  address: string
}
