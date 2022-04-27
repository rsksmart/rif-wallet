import React from 'react'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { BalanceRowComponent } from './BalanceRowComponent'
import { Paragraph } from '../../components'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { ScrollView } from 'react-native-gesture-handler'

interface Interface {
  selectedAddress?: string
  setSelected: (token: string) => void
}

const PortfolioComponent: React.FC<Interface> = ({
  selectedAddress,
  setSelected,
}) => {
  const { state } = useSocketsState()
  const balances = Object.values(state.balances)

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Paragraph style={styles.heading}>portfolio</Paragraph>
      {/* @JESSE todo! */}
      {balances.length === 0 && (
        <Text style={styles.emptyState}>no balances yet</Text>
      )}
      <View style={styles.scrollView}>
        {balances.map((balance: ITokenWithBalance, i: number) => (
          <View style={i % 2 ? styles.rightColumn : styles.leftColumn} key={i}>
            <BalanceRowComponent
              token={balance}
              onPress={setSelected}
              selected={selectedAddress === balance.contractAddress}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  heading: {
    color: colors.white,
  },
  balances: {
    borderWidth: 1,
    borderColor: '#FFCC33',
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 500,
  },
  row: {},
  leftColumn: {
    ...grid.column6,
    paddingRight: 10,
  },
  rightColumn: {
    ...grid.column6,
    paddingLeft: 10,
  },

  scrollView: {
    ...grid.row,
    flexWrap: 'wrap',
  },
  container: {
    borderWidth: 1,
    borderColor: '#FFCC33',
  },
  emptyState: {
    paddingBottom: 20,
  },
})

export default PortfolioComponent
