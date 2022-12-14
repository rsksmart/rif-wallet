export interface Contact {
  id: string
  name: string
  address: string
  displayAddress: string
}

export interface ContactsState {
  contacts: Record<string, Contact>
  selectedContact: Contact | null
}

export interface SaveContactPayload {
  name: string
  address: string
  displayAddress: string
}
