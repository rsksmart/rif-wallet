import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { grid } from '../../styles/grid'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { TokenImage } from './TokenImage'
import { colors } from '../../styles/colors'
import { GrayButton } from '../../components/button/ButtonVariations'
import { HideShowIcon } from '../../components/icons/HideShowIcon'
import { balanceToDisplay } from '../../lib/utils'

interface Interface {
  token: ITokenWithBalance
  accountNumber?: number
}

const SelectedTokenComponent: React.FC<Interface> = ({
  token,
  accountNumber,
}) => {
  const [showBalances, setShowBalances] = useState<boolean>(true)

  return (
    <View style={styles.amountRow}>
      <View style={styles.hideRow}>
        <GrayButton
          title={showBalances ? ' hide' : ' show'}
          onPress={() => setShowBalances(!showBalances)}
          icon={<HideShowIcon height={24} width={24} isHidden={showBalances} />}
        />
      </View>
      {showBalances ? (
        <>
          <View style={grid.row}>
            <View style={{ ...grid.column2, ...styles.icon }}>
              <TokenImage symbol={token.symbol} height={45} width={45} />
            </View>
            <View style={grid.column10}>
              <Text style={styles.amount}>
                {balanceToDisplay(token.balance, token.decimals, 5)}
              </Text>
            </View>
          </View>

          {typeof accountNumber === 'number' && (
            <View style={grid.row}>
              <View style={grid.column}>
                <Text style={styles.account}>{`Account ${
                  accountNumber + 1
                }`}</Text>
              </View>
            </View>
          )}
        </>
      ) : (
        <View style={grid.row}>
          <Text style={{ ...styles.amount, ...styles.amountHidden }}>
            {'\u25CF    \u25CF     \u25CF     \u25CF     \u25CF'}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  hideRow: {
    ...grid.row,
    alignSelf: 'flex-end',
  },
  amountRow: {
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.lightPurple,
  },
  icon: {
    marginTop: 10,
  },
  amount: {
    color: colors.darkBlue,
    fontSize: 50,
    fontWeight: '500',
    marginLeft: 10,
  },
  account: {
    fontSize: 16,
    fontWeight: '300',
    marginTop: 10,
    color: colors.darkGray,
  },
  amountHidden: {
    fontSize: 20,
    paddingVertical: 18,
  },
})

export default SelectedTokenComponent
