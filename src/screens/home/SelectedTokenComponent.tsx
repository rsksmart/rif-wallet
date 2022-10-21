import { BigNumberish } from 'ethers'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RegularText } from '../../components'

import { EditMaterialIcon, HideShowIcon } from '../../components/icons'
import { CheckIcon } from '../../components/icons/CheckIcon'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'

interface Interface {
  accountNumber?: number
  amount: BigNumberish
  change?: number
}

const SelectedTokenComponent: React.FC<Interface> = ({
  accountNumber,
  amount,
  change,
}) => {
  const initialAccountName =
    typeof accountNumber === 'number' ? `account ${accountNumber + 1}` : ''
  const [accountName, setAccountName] = useState<string>(initialAccountName)
  const [showBalances, setShowBalances] = useState<boolean>(true)
  const [showAccountNameInput, setShowAccountInput] = useState<boolean>(false)
  const badgeColor = change && change >= 0 ? styles.greenBadge : styles.redBadge
  const onSetBalances = () => setShowBalances(!showBalances)

  const onChangeAccountName = (text: string) => {
    if (text.length <= 30) {
      setAccountName(text)
    }
  }

  const onEdit = () => {
    setShowAccountInput(true)
  }

  const onSubmit = () => {
    if (accountName.length > 0) {
      setAccountName(accountName.trim())
      setShowAccountInput(false)
    }
  }

  return (
    <View style={styles.balanceCard}>
      <View style={styles.topRow}>
        {typeof accountNumber === 'number' && (
          <View style={styles.accountLabel}>
            {!showAccountNameInput ? (
              <>
                <RegularText style={styles.accountText}>
                  {accountName}
                </RegularText>
                <TouchableOpacity onPress={onEdit}>
                  <EditMaterialIcon
                    color={colors.darkPurple2}
                    size={16}
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  autoFocus={true}
                  style={styles.accountInput}
                  value={accountName}
                  onChangeText={onChangeAccountName}
                  onSubmitEditing={onSubmit}
                />
                <TouchableOpacity onPress={onSubmit}>
                  <View>
                    <CheckIcon
                      color={colors.darkPurple2}
                      width={30}
                      height={30}
                    />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        <TouchableOpacity onPress={onSetBalances}>
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
    paddingVertical: 18,
  },
})

export default SelectedTokenComponent
