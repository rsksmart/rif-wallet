import React, { useContext } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { NavigationProp } from '../../RootNavigation'
import LinearGradient from 'react-native-linear-gradient'
import { setOpacity } from '../home/tokenColor'
import { grid } from '../../styles/grid'
import { SquareButton } from '../../components/button/SquareButton'
import PlusIcon from '../../components/icons/PlusIcon'
import { ContactsContext, IContact } from './ContactsContext'
import { Paragraph } from '../../components'
import { Arrow } from '../../components/icons'
import DeleteIcon from '../../components/icons/DeleteIcon'

export const ContactsScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { contacts, deleteContact } = useContext(ContactsContext)

  return (
    <LinearGradient
      colors={['#f4f4f4', setOpacity('#373f48', 0.3)]}
      style={styles.parent}>
      <View style={styles.titleLine}>
        <Text style={styles.header}>My Contacts</Text>
        <SquareButton
          title="add"
          color="#000"
          onPress={() => navigation.navigate('ContactEdit' as any)}
          icon={<PlusIcon color={'#000'} />}
        />
      </View>
      <ScrollView style={styles.contacts}>
        {contacts.length === 0 && <Paragraph>No contacts yet</Paragraph>}
        {contacts.map(contact => (
          <ContactRow
            key={contact.id.toString()}
            contact={contact}
            deleteContact={deleteContact}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </LinearGradient>
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
    fontSize: 26,
    textAlign: 'center',
    color: '#5c5d5d',
  },
  parent: {
    height: '100%',
  },
  contacts: {
    margin: 20,
    backgroundColor: '#FFFFFF',
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
    justifyContent: 'space-around',
  },
  center: {
    alignItems: 'center',
  },
})
