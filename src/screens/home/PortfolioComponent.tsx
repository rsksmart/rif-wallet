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
    <View style={styles.container}>
      <Paragraph style={styles.heading}>portfolio</Paragraph>
      {/* @JESSE todo! */}
      {balances.length === 0 && (
        <Text style={styles.emptyState}>no balances yet</Text>
      )}

      <ScrollView>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            {balances[0] && (
              <BalanceRowComponent
                token={balances[0]}
                onPress={setSelected}
                selected={false}
              />
            )}
          </View>
          <View style={styles.rightColumn}>
            <BalanceRowComponent
              token={balances[1]}
              onPress={setSelected}
              selected={false}
            />
          </View>
          <View style={styles.leftColumn}>
            <BalanceRowComponent
              token={balances[2]}
              onPress={setSelected}
              selected={false}
            />
          </View>
        </View>
      </ScrollView>

      <ScrollView style={styles.balances}>
        {balances.map((token: any) => (
          <BalanceRowComponent
            key={token.contractAddress}
            selected={selectedAddress === token.contractAddress}
            token={token}
            onPress={setSelected}
            /*quota={state?.prices[token.contractAddress]}*/
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    color: colors.white,
  },
  balances: {
    borderWidth: 1,
    borderColor: '#FFCC33',
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 500,
    // flexWrap: 'wrap',
    // flexGrow: 0.5,
    height: 350,
    /*
    flexDirection: 'column',
    */
  },
  row: {
    ...grid.row,
    flexWrap: 'wrap',
  },
  leftColumn: {
    ...grid.column6,
    paddingRight: 10,
  },
  rightColumn: {
    ...grid.column6,
    paddingLeft: 10,
  },
  container: {
    // paddingHorizontal: 25,
    // borderRadius: 25,
  },
  emptyState: {
    paddingBottom: 20,
  },
})

export default PortfolioComponent
