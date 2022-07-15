import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RegularText } from '../../components'
import { shortAddress } from '../../lib/utils'
import { colors } from '../../styles'
import { TransactionsServerResponseWithActivityTransactions } from '../../subscriptions/types'

interface Props {
  transactions: TransactionsServerResponseWithActivityTransactions
  onSelect: (address: string) => void
}

export const RecentTransactions: React.FC<Props> = ({
  transactions,
  onSelect,
}) => {
  // get recipient addresses from transactions
  const recentRecipientAddresses = new Set(
    transactions.activityTransactions
      .map(({ enhancedTransaction: et }) => et?.to)
      .filter(to => !!to) as string[],
  )

  // convert set to list and get last 5 items
  const addresses = [...recentRecipientAddresses].slice(0, 5)

  if (addresses.length === 0) {
    return (
      <View style={styles.mb40}>
        <RegularText style={[styles.empty, styles.ml10]}>
          no recent transactions
        </RegularText>
      </View>
    )
  }

  return (
    <View style={styles.mb40}>
      {addresses.map((address: string) => (
        <TouchableOpacity
          key={address}
          testID={`${address}.Button`}
          onPress={() => onSelect(address)}>
          <View style={styles.container}>
            <View style={styles.firstHalf}>
              <RegularText style={styles.addressText}>
                {shortAddress(address, 10)}
              </RegularText>
            </View>
            <View style={styles.secondHalf}>
              <RegularText style={[styles.selectLabel, styles.mr10]}>
                select
              </RegularText>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple5,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 30,
    marginBottom: 5,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.white,
  },
  selectLabel: {
    color: colors.white,
  },
  firstHalf: {
    flexGrow: 50,
    flexDirection: 'row',
  },
  secondHalf: {
    flexGrow: 50,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  empty: {
    color: colors.white,
  },
  ml10: { marginLeft: 10 },
  mr10: { marginRight: 10 },
  mb40: { marginBottom: 40 },
})
