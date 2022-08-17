import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { Arrow, ShareIcon } from '../../components/icons'
import DeleteIcon from '../../components/icons/DeleteIcon'
import EditMaterialIcon from '../../components/icons/EditMaterialIcon'
import SendIcon from '../../components/icons/SendIcon'
import { shortAddress } from '../../lib/utils'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { IContact } from './ContactsContext'

interface IContactRowProps {
  contact: IContact
  onSend: () => void
  onDelete: () => void
  onEdit: () => void
  selected: boolean
}

export const ContactRow: React.FC<IContactRowProps> = ({
  contact,
  onSend,
  onDelete,
  onEdit,
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
          <Icon.Button
            name="arrow-up-right"
            onPress={onSend}
            backgroundColor={colors.purple}
            iconStyle={styles.sendButton}
            size={15}
            borderRadius={20}
          />
          <DeleteIcon
            style={styles.deleteButton}
            color={colors.purple}
            viewBox={'-8 -8 40 40'}
            width={32}
            height={32}
            onPress={onDelete}
          />
          <EditMaterialIcon
            color={colors.purple}
            size={17}
            style={styles.editButton}
            onPress={onEdit}
          />
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
  sendButton: {
    color: colors.darkBlue,
    padding: 0,
    marginRight: 0,
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
  },
})
