import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow } from '../../components/icons'
import DeleteIcon from '../../components/icons/DeleteIcon'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { grid } from '../../styles/grid'
import { IContact } from './ContactsContext'

export const ContactRow: React.FC<{
  contact: IContact
  deleteContact: (id: string | number[]) => void
  navigation: any
}> = ({ contact, deleteContact, navigation }) => (
  <View style={{ ...grid.row, ...styles.row }}>
    <View style={grid.column}>
      <Text style={styles.label}>{contact.name}</Text>
      <Text style={styles.address}>{contact.displayAddress}</Text>
    </View>
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

const styles = StyleSheet.create({
  row: {
    paddingVertical: 20,
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: colors.background.primary,
  },

  label: {
    fontFamily: fonts.regular,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    paddingLeft: 20,
  },
  address: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.text.secondary,
    paddingLeft: 20,
  },
  center: {
    alignItems: 'center',
  },
})
