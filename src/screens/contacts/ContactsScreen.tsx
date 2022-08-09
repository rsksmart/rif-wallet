import React, { useContext } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Paragraph } from '../../components'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow } from '../../components/icons'
import DeleteIcon from '../../components/icons/DeleteIcon'
import PlusIcon from '../../components/icons/PlusIcon'
import { NavigationProp } from '../../RootNavigation'
import { colors } from '../../styles'
import { grid } from '../../styles/grid'
import { setOpacity } from '../home/tokenColor'
import { ContactsContext, IContact } from './ContactsContext'

export const ContactsScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { contacts, deleteContact } = useContext(ContactsContext)

  return (
    <View style={styles.parent}>
      <View style={styles.titleLine}>
        <Text style={styles.header}>contacts</Text>
        <SquareButton
          title="add"
          onPress={() => navigation.navigate('ContactEdit' as never)}
          icon={<PlusIcon color={'#000'} />}
        />
      </View>
      <ScrollView style={styles.contacts}>
        {contacts.length === 0 && (
          <Paragraph style={styles.noContacts}>no contacts yet</Paragraph>
        )}
        {contacts.map(contact => (
          <ContactRow
            key={contact.id.toString()}
            contact={contact}
            deleteContact={deleteContact}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const ContactRow: React.FC<{
  contact: IContact
  deleteContact: (id: string | number[]) => void
  navigation: any
}> = ({ contact, deleteContact, navigation }) => (
  <View style={{ ...grid.row, ...styles.row }}>
    <View style={grid.column3}>
      <Text style={styles.label}>{contact.name}</Text>
    </View>
    <View style={grid.column9}>
      <Text>{contact.displayAddress}</Text>
    </View>
    <View style={grid.column3} />
    <View
      style={{
        ...grid.column3,
        ...styles.center,
      }}>
      <SquareButton
        color={'#c73d3d'}
        onPress={() => {
          deleteContact(contact.id)
        }}
        title="delete"
        icon={<DeleteIcon color={'#c73d3d'} />}
      />
    </View>
    <View
      style={{
        ...grid.column3,
        ...styles.center,
      }}>
      <SquareButton
        color={'#000'}
        onPress={() => {
          navigation.navigate('Send', {
            to: contact.address,
            displayTo: contact.displayAddress,
          })
        }}
        title="send"
        icon={<Arrow color={'#000'} rotate={45} />}
      />
    </View>
  </View>
)

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    color: colors.text.primary,
    padding: 20,
  },
  parent: {
    height: '100%',
    backgroundColor: '#020034',
    padding: 20,
  },
  noContacts: {
    color: colors.text.primary,
  },
  contacts: {
    backgroundColor: setOpacity('#ffffff', 0.05),
    borderRadius: 20,
    padding: 20,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: '600',
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
  },
})
