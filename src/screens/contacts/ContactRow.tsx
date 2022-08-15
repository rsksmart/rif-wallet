import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
        ...grid.row,
        ...styles.card,
        backgroundColor: selected
          ? colors.background.bustyBlue
          : colors.background.primary,
      }}>
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
}

const styles = StyleSheet.create({
  card: {
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
