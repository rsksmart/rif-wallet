import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BalanceCardComponent } from './BalanceCardComponent'
import { Paragraph } from '../../components'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { ScrollView } from 'react-native-gesture-handler'
import { IPrice } from '../../subscriptions/types'

interface Interface {
  selectedAddress?: string
  setSelected: (token: string) => void
  balances: ITokenWithBalance[]
  prices: Record<string, IPrice>
}

const PortfolioComponent: React.FC<Interface> = ({
  selectedAddress,
  setSelected,
  balances,
  prices,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={grid.row}>
        <Paragraph style={styles.heading}>portfolio</Paragraph>
      </View>
      <View style={styles.scrollView}>
        {balances.map((balance: ITokenWithBalance, i: number) => (
          <View style={i % 2 ? styles.rightColumn : styles.leftColumn} key={i}>
            <BalanceCardComponent
              token={balance}
              onPress={setSelected}
              selected={selectedAddress === balance.contractAddress}
              price={prices[balance.contractAddress]}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  heading: {
    ...grid.column12,
    color: colors.white,
  },
  balances: {
    borderWidth: 1,
    borderColor: '#FFCC33',
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 500,
  },
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
    width: '100%',
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
