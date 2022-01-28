import React from 'react'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { BalanceRowComponent } from './BalanceRowComponent'

interface Interface {
  selected?: ITokenWithBalance
  setSelected: (token: ITokenWithBalance) => void
  visible: boolean
  setPanelActive: () => void
}

const PortfolioComponent: React.FC<Interface> = ({
  selected,
  setSelected,
  visible,
  setPanelActive,
}) => {
  const { state } = useSocketsState()

  const balances = Object.values(state.balances)

  return (
    <View style={styles.portfolio}>
      <TouchableOpacity onPress={setPanelActive} disabled={visible}>
        <Text style={styles.heading}>portfolio</Text>
      </TouchableOpacity>
      {visible && balances.length === 0 && (
        <Text style={styles.emptyState}>no balances yet</Text>
      )}
      {visible &&
        balances.map((token: any) => (
          <BalanceRowComponent
            key={token.contractAddress}
            selected={selected?.contractAddress === token.contractAddress}
            token={token}
            onPress={() => setSelected(token)}
            quota={state?.prices[token.contractAddress]}
          />
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    paddingVertical: 15,
    fontSize: 16,
    color: '#66777E',
  },
  portfolio: {
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  emptyState: {
    paddingBottom: 20,
  },
})

export default PortfolioComponent
