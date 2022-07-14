import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { shortAddress } from '../../lib/utils'
import { colors } from '../../styles'
import { useSocketsState } from '../../subscriptions/RIFSockets'

interface Props {
  onSelect: (address: string) => void
}

export const RecentTransactions: React.FC<Props> = ({ onSelect }) => {
  const {
    state: { transactions },
  } = useSocketsState()

  const recentRecipientAddresses = new Set(
    transactions?.activityTransactions?.map(
      ({ originTransaction: { to } }) => to,
    ),
  )

  // convert set to list and get last 5 items
  const addresses = [...recentRecipientAddresses].slice(0, 5)

  return (
    <View>
      <FlatList
        style={styles.mb40}
        data={addresses}
        renderItem={({ item: address }) => (
          <TouchableOpacity
            onPress={() => onSelect(address)}
            testID={`${address}.Button`}>
            <View style={styles.container}>
              <View style={styles.firstHalf}>
                <Text style={[styles.secondaryText, styles.ml10]}>
                  {shortAddress(address, 10)}
                </Text>
              </View>
              <View style={styles.secondHalf}>
                <Text style={[styles.secondaryText, styles.mr10]}>select</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    marginTop: 18,
  },
  mainText: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: colors.text.secondary,
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

  ml10: { marginLeft: 10 },
  mr10: { marginRight: 10 },
  mb40: { marginBottom: 40 },
})
