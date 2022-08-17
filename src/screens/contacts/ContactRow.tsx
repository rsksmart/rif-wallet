import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import DeleteIcon from '../../components/icons/DeleteIcon'
import EditMaterialIcon from '../../components/icons/EditMaterialIcon'
import { shortAddress } from '../../lib/utils'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { IContact } from './ContactsContext'

interface IContactRowProps {
  contact: IContact
  onDelete: () => void
  onEdit: () => void
  navigation: any
  selected: boolean
}

export const ContactRow: React.FC<IContactRowProps> = ({
  contact,
  onDelete,
  onEdit,
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
            style={styles.deleteButton}
            color={colors.purple}
            viewBox={'-8 -8 40 40'}
            width={30}
            height={30}
            onPress={onDelete}
          />
          <DeleteIcon
            style={styles.deleteButton}
            color={colors.purple}
            viewBox={'-8 -8 40 40'}
            width={30}
            height={30}
            onPress={onDelete}
          />
          <EditMaterialIcon color={colors.purple} size={16} style={styles.editButton} onPress={onEdit}/>
        </View>
      )}
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
    flex: 5,
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
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteButton: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.lightPurple,
  },
  editButton: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.lightPurple,
    padding: 6,
  }
})
