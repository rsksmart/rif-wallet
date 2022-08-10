import React, { useContext } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Paragraph } from '../../components'
import PrimaryButton from '../../components/button/PrimaryButton'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow } from '../../components/icons'
import DeleteIcon from '../../components/icons/DeleteIcon'
import PlusIcon from '../../components/icons/PlusIcon'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { NavigationProp } from '../../RootNavigation'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { grid } from '../../styles/grid'
import { setOpacity } from '../home/tokenColor'
import { ContactsContext, IContact } from './ContactsContext'

export const ContactsScreen: React.FC<{
  navigation: NavigationProp
}> = ({ navigation }) => {
  const { contacts, deleteContact } = useContext(ContactsContext)

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <PrimaryButton
          style={styles.addButton}
          onPress={() => navigation.navigate('ContactEdit' as never)}>
          {/* Change this icon later */}
          <PlusIcon style={styles.addButtonIcon} color={'#fff'} />
        </PrimaryButton>
      </View>
      <ScrollView style={styles.contacts}>
        {contacts.length === 0 && (
          <Paragraph style={styles.noContacts}>no contacts yet</Paragraph>
        )}
        {contacts.map(contact => (
          <>
            <View style={styles.searchView}>
              <TextInput
                style={styles.searchInput}
                placeholder={'type to find...'}
                placeholderTextColor={colors.purple}
              />
              <SearchIcon
                color={colors.purple}
                width={40}
                height={40}></SearchIcon>
            </View>
            <ContactRow
              key={contact.id.toString()}
              contact={contact}
              deleteContact={deleteContact}
              navigation={navigation}
            />
          </>
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
  parent: {
    height: '100%',
    backgroundColor: colors.background.darkBlue,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.text.primary,
    padding: 10,
  },
  addButton: {
    backgroundColor: colors.background.bustyBlue,
    flexDirection: 'row',
    height: 32,
    width: 32,
  },
  addButtonIcon: {
    alignSelf: 'center',
  },
  searchView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.darkBlue,
    borderWidth: 0.8,
    borderColor: colors.purple,
    borderRadius: 40,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 5,
    fontSize: 14,
    color: colors.purple,
    fontFamily: fonts.regular,
  },
  noContacts: {
    fontFamily: fonts.regular,
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
  center: {
    alignItems: 'center',
  },
})
