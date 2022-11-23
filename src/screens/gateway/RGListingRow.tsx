import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { IRGListing } from 'src/lib/gateway'
import DeleteIcon from '../../components/icons/DeleteIcon'
import EditMaterialIcon from '../../components/icons/EditMaterialIcon'
import { shortAddress } from '../../lib/utils'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { useSocketsState } from '../../subscriptions/RIFSockets'

enum IRGListingAction {
  LEND,
  BORROW,
  PAY,
  WITHDRAW,
}

interface IContactRowProps {
  listing: IRGListing
  selected: boolean
  onPress: () => void
  onAction: (action: IRGListingAction, listing: IRGListing) => void
}

export const ContactRow: React.FC<IContactRowProps> = ({
  listing,
  selected,
  onPress,
  onAction,
}) => {
  const { state } = useSocketsState()
  const hideSendButton = Object.values(state.balances).length === 0

  return (
    <View
      style={{
        ...styles.card,
        backgroundColor: selected
          ? colors.background.bustyBlue
          : colors.background.primary,
      }}>
      <TouchableOpacity
        testID={`contactCard-${listing.id}`}
        accessibilityLabel={`contactCard-${listing.name}`}
        key={listing.id.toNumber()}
        onPress={onPress}
        style={styles.contactInfo}>
        <Text style={styles.contactName}>{listing.name}</Text>
        <Text style={styles.address}>{+listing.interestRate / 1e20}%</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        {/* {!hideSendButton ? (
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
        /> */}
      </View>
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
    flex: 5,
    paddingVertical: 20,
    paddingHorizontal: 20,
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
