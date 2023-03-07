import { Contact } from 'shared/types'

export interface ContactsState {
  contacts: Record<string, Contact>
  selectedContact: Contact | null
}

export interface SaveContactPayload {
  name: string
  address: string
  displayAddress: string
}
