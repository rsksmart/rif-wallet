import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Jdenticon from 'react-native-jdenticon'
import Icon from 'react-native-vector-icons/Feather'
import DeleteIcon from '../../components/icons/DeleteIcon'
import EditMaterialIcon from '../../components/icons/EditMaterialIcon'
import { shortAddress } from '../../lib/utils'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { IContact } from './ContactsContext'

interface IContactRowProps {
  index: number
  contact: IContact
  selected: boolean
  hideSendButton?: boolean
  onSend: (contact: IContact) => void
  onDelete: (contact: IContact) => void
  onEdit: (contact: IContact) => void
  onPress: () => void
}

export const ContactRow: React.FC<IContactRowProps> = ({
  index,
  contact,
  selected,
  onPress,
  onSend,
  onDelete,
  onEdit,
}) => {
  const { state } = useSocketsState()
  const hideSendButton = Object.values(state.balances).length === 0

  const avatarConfig = {
    lightness: {
      color: [0.4, 0.8],
      grayscale: [0.3, 0.6],
    },
    saturation: {
      color: 0.7,
      grayscale: 0.5,
    },
    padding: 0.15,
  }
  return (
    <View
      style={{
        ...styles.card,
        backgroundColor: selected
          ? colors.background.bustyBlue
          : colors.background.primary,
      }}>
      <TouchableOpacity
        testID={`contactCard-${index}`}
        accessibilityLabel={`contactCard-${index}`}
        key={index}
        onPress={onPress}
        style={styles.contactInfo}>
        <Jdenticon
          size={40}
          value={contact.name + contact.address}
          style={styles.avatar}
          config={avatarConfig}
        />
        <View>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.address}>
            {shortAddress(contact.displayAddress, 8)}
          </Text>
        </View>
      </TouchableOpacity>
      {selected && (
        <View style={styles.actions}>
          {!hideSendButton ? (
            <Icon.Button
              testID={`sendButton-${index}`}
              accessibilityLabel={`sendButton-${index}`}
              name="arrow-up-right"
              onPress={() => onSend(contact)}
              backgroundColor={colors.purple}
              iconStyle={styles.sendButton}
              size={15}
              borderRadius={20}
            />
          ) : (
            <View style={styles.emptyView} />
          )}
          <DeleteIcon
            testID={`deleteButton-${index}`}
            accessibilityLabel={`deleteButton-${index}`}
            style={styles.deleteButton}
            color={colors.purple}
            viewBox={'-8 -8 40 40'}
            width={32}
            height={32}
            onPress={() => onDelete(contact)}
          />
          <EditMaterialIcon
            testID={`editButton-${index}`}
            accessibilityLabel={`editButton-${index}`}
            color={colors.purple}
            size={17}
            style={styles.editButton}
            onPress={() => onEdit(contact)}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: 5,
    borderRadius: 15,
  },
  contactInfo: {
    flexDirection: 'row',
    flex: 5,
    paddingVertical: 20,
  },
  avatar: {
    marginHorizontal: 20,
    borderRadius: 50,
    backgroundColor: colors.lightPurple,
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
  emptyView: {
    width: 32,
  },
  actions: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
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
    marginLeft: 5,
  },
  editButton: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.lightPurple,
    padding: 6,
  },
})
