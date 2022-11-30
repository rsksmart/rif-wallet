import React, { useEffect, useState } from 'react'

import { getContacts, saveContacts } from '../../storage/MainStorage'
import uuid from 'react-native-uuid'

export interface IContact {
  id?: string | number[]
  name: string
  address: string
  displayAddress: string
}

export interface ContactsContextInterface {
  contacts: IContact[]
  isLoading: boolean
  addContact: (name: string, address: string, displayAddress: string) => void
  editContact: (contact: IContact) => void
  deleteContact: (id: string | number[]) => void
}

export const ContactsContext = React.createContext<ContactsContextInterface>({
  contacts: [],
  isLoading: true,
  addContact: () => {},
  editContact: () => {},
  deleteContact: () => {},
})

export const ContactsProviderElement: React.FC = ({ children }) => {
  const [contacts, setContacts] = useState<IContact[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setContacts(getContacts() ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) {
      return
    }

    saveContacts(contacts)
  }, [contacts, isLoading])

  const addContact = (
    name: string,
    address: string,
    displayAddress: string,
  ) => {
    const id = uuid.v4()

    setContacts(prev => [...prev, { id, name, address, displayAddress }])
  }

  const editContact = (contact: IContact) => {
    const editing = contacts.filter(x => x.id !== contact.id)

    setContacts([...editing, contact])
  }

  const deleteContact = (id: string | number[]) => {
    const editing = contacts.filter(x => x.id !== id)

    setContacts([...editing])
  }

  const initialContext: ContactsContextInterface = {
    contacts,
    isLoading,
    addContact,
    editContact,
    deleteContact,
  }

  return (
    <ContactsContext.Provider value={initialContext}>
      {children}
    </ContactsContext.Provider>
  )
}
