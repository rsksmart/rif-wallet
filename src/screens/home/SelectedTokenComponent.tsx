import { BigNumberish } from 'ethers'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { RegularText, SemiBoldText } from 'components/index'
import { HideShowIcon } from 'components/icons'
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'

interface Props {
  accountName: string
  amount: BigNumberish
  change?: number
}

const SelectedTokenComponent = ({ accountName, amount, change }: Props) => {
  const [showBalances, setShowBalances] = useState<boolean>(true)
  const badgeColor = change && change >= 0 ? styles.greenBadge : styles.redBadge
  const onSetBalances = () => setShowBalances(!showBalances)

  return (
    <View style={styles.balanceCard}>
      <View style={styles.topRow}>
        {accountName && (
          <View style={styles.accountLabel}>
            <RegularText style={styles.accountText}>{accountName}</RegularText>
          </View>
        )}
        <TouchableOpacity onPress={onSetBalances} accessibilityLabel="hide">
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
          <SemiBoldText style={{ ...styles.amount, ...styles.amountHidden }}>
            {'\u25CF    \u25CF     \u25CF     \u25CF     \u25CF'}
          </SemiBoldText>
        )}
      </View>
      {!!change && (
        <View style={styles.changeRow}>
          <View style={{ ...styles.badge, ...badgeColor }}>
            <RegularText style={styles.badgeText}>
              {`${change > 0 ? '+' : ''}${change}%`}
            </RegularText>
          </View>
        </View>
      )}
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
    flexDirection: 'row',
    paddingTop: 5,
    alignItems: 'center',
  },
  accountText: {
    color: colors.darkGray,
    borderWidth: 1,
    borderColor: colors.lightPurple,
    paddingHorizontal: 5,
    paddingTop: 3,
    paddingBottom: 1,
  },
  accountInput: {
    color: colors.darkGray,
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: colors.darkPurple,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingTop: 0,
    paddingBottom: 0,
  },
  editIcon: {
    marginLeft: 2,
    marginBottom: 5,
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
    paddingVertical: 15,
  },
})

export default SelectedTokenComponent
