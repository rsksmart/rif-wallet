import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import DeleteIcon from '../../components/icons/DeleteIcon'
import { shortAddress } from '../../lib/utils'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { grid } from '../../styles/grid'
import { IContact } from './ContactsContext'

interface IContactRowProps {
  contact: IContact
  deleteContact: (id: string | number[]) => void
  navigation: any
  selected: boolean
}

export const ContactRow: React.FC<IContactRowProps> = ({
  contact,
  deleteContact,
  navigation,
  selected,
}) => {
  return (
    <View
      style={{
        ...styles.card,
        backgroundColor: selected
          ? colors.background.bustyBlue
          : colors.background.primary,
      }}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.address}>
          {shortAddress(contact.displayAddress, 8)}
        </Text>
      </View>
      {selected && (
        <View style={styles.actions}>
          <DeleteIcon
            style={styles.delete}
            color={colors.purple}
            viewBox={'-8 -8 40 40'}
            width={30}
            height={30}
            onPress={() => deleteContact(contact.id)}
          />
        </View>
      )}
      {/* //     <View style={grid.column3}>
//       <Text style={styles.label}>{contact.name}</Text>
//     </View>
//     <View style={grid.column9}>
//       <Text>{contact.displayAddress}</Text>
//     </View>
//     <View style={grid.column3} />
//     <View
//       style={{
//         ...grid.column3,
//         ...styles.center,
//       }}>
//       <SquareButton
//         color={'#c73d3d'}
//         onPress={() => {
//           deleteContact(contact.id)
//         }}
//         title="delete"
//         icon={<DeleteIcon color={'#c73d3d'} />}
//       />
//     </View>
//     <View
//       style={{
//         ...grid.column3,
//         ...styles.center,
//       }}>
//       <SquareButton
//         color={'#000'}
//         onPress={() => {
//           navigation.navigate('Send', {
//             to: contact.address,
//             displayTo: contact.displayAddress,
//           })
//         }}
//         title="send"
//         icon={<Arrow color={'#000'} rotate={45} />}
//       />
//     </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 20,
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: fonts.regular,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  address: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.text.secondary,
  },
  actions: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  delete: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.lightPurple,
  },
})
