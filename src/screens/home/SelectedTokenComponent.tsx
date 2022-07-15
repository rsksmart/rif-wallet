import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BigNumberish } from 'ethers'
import { RegularText } from '../../components'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { colors } from '../../styles'
import { HideShowIcon } from '../../components/icons'

interface Interface {
  accountNumber?: number
  amount: BigNumberish
  change: number
}

const SelectedTokenComponent: React.FC<Interface> = ({
  accountNumber,
  amount,
  change,
}) => {
  const [showBalances, setShowBalances] = useState<boolean>(true)
  const badgeColor = change >= 0 ? styles.greenBadge : styles.redBadge
  return (
    <View style={styles.balanceCard}>
      <View style={styles.topRow}>
        {typeof accountNumber === 'number' && (
          <View style={styles.accountLabel}>
            <RegularText style={styles.accountText}>{`account ${
              accountNumber + 1
            }`}</RegularText>
          </View>
        )}
        <TouchableOpacity onPress={() => setShowBalances(!showBalances)}>
          <View style={styles.badge}>
            <HideShowIcon
              style={styles.icon}
              height={15}
              width={15}
              isHidden={showBalances}
            />
            <RegularText style={styles.badgeText}>
              {showBalances ? ' hide' : ' show'}
            </RegularText>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        {showBalances ? (
          <RegularText style={styles.amount}>{amount}</RegularText>
        ) : (
          <Text style={{ ...styles.amount, ...styles.amountHidden }}>
            {'\u25CF    \u25CF     \u25CF     \u25CF     \u25CF'}
          </Text>
        )}
      </View>
      <View style={styles.changeRow}>
        <View style={{ ...styles.badge, ...badgeColor }}>
          <RegularText style={styles.badgeText}>
            {`${change > 0 ? '+' : ''}${change}%`}
          </RegularText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  balanceCard: {
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.lightPurple,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountLabel: {
    paddingTop: 5,
  },
  accountText: {
    color: colors.darkGray,
  },
  badge: {
    backgroundColor: colors.lightGray,
    padding: 8,
    borderRadius: 25,
    flexDirection: 'row',
  },
  greenBadge: {
    backgroundColor: colors.green,
  },
  redBadge: {
    backgroundColor: colors.red,
  },
  icon: {
    paddingTop: 15,
  },
  badgeText: {
    fontSize: 10,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  amount: {
    color: colors.darkBlue,
    fontSize: 50,
    fontWeight: '500',
  },

  amountHidden: {
    fontSize: 20,
    paddingVertical: 18,
  },
})

export default SelectedTokenComponent
