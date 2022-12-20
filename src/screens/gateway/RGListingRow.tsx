import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { CheckIcon } from 'src/components/icons/CheckIcon'
import { IRGListing, IRGListingAction, RGSERVICE_TYPE } from 'src/lib/gateway'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'

interface IRGListingRowProps {
  index: string
  listing: IRGListing
  selected: boolean
  consumed?: boolean
  onPress: (listing: IRGListing, index: string) => void
  onAction: (action: IRGListingAction, showsModal?: boolean) => void
}

export const RGListingRow: React.FC<IRGListingRowProps> = ({
  index,
  listing,
  selected,
  consumed,
  onPress,
  onAction,
}) => {
  return (
    <View
      style={{
        ...styles.card,
        backgroundColor: selected
          ? colors.background.bustyBlue
          : colors.background.primary,
      }}>
      <TouchableOpacity
        testID={`rgListing-${listing.id}`}
        accessibilityLabel={`rgListing-${listing.name}`}
        key={index}
        onPress={() => {
          onPress(listing, index)
        }}
        style={styles.contactInfo}>
        <Text style={styles.contactName}>
          {listing.validated && (
            <CheckIcon width={20} height={20} color="#fff" />
          )}
          {listing.name}
        </Text>
        <Text style={styles.address}>{listing.currencySymbol}</Text>
        <Text style={styles.address}>
          {(+listing.interestRate / 1e16).toFixed(2)}%
          {listing.type === RGSERVICE_TYPE.LENDING && <> APY</>}
          {listing.type === RGSERVICE_TYPE.BORROWING && <> Interest</>}
        </Text>
        {!consumed && (
          <Text style={styles.address}>
            From {+listing.minAmount / 1e18} to {+listing.maxAmount / 1e18}{' '}
            {listing.currencySymbol}
          </Text>
        )}
        {consumed && listing.balance && (
          <Text style={styles.address}>
            Balance: {+listing.balance / 1e18} {listing.currencySymbol}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.actions}>
        {selected ? (
          <>
            {!consumed && (
              <Icon.Button
                testID={`sendButton-${index}`}
                accessibilityLabel={`sendButton-${index}`}
                name="arrow-up-right"
                onPress={() => {
                  onAction(
                    listing.type === RGSERVICE_TYPE.LENDING
                      ? IRGListingAction.LEND
                      : IRGListingAction.BORROW,
                  )
                }}
                backgroundColor={colors.purple}
                iconStyle={styles.sendButton}
                size={15}
                borderRadius={20}
              />
            )}
            {consumed && (
              <Icon.Button
                testID={`sendButton-${index}`}
                accessibilityLabel={`sendButton-${index}`}
                name="arrow-down-left"
                onPress={() => {
                  onAction(
                    listing.type === RGSERVICE_TYPE.LENDING
                      ? IRGListingAction.WITHDRAW
                      : IRGListingAction.PAY,
                    false,
                  )
                }}
                backgroundColor={colors.purple}
                iconStyle={styles.sendButton}
                size={15}
                borderRadius={20}
              />
            )}
          </>
        ) : (
          <View style={styles.emptyView} />
        )}
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
    flexDirection: 'row',
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
    justifyContent: 'flex-end',
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
