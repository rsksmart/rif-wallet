import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { G, Svg, Path } from 'react-native-svg'
import { SquareButton } from '../../components/button/SquareButton'
import { grid } from '../../styles/grid'
import { BalancesRow } from '../balances/BalancesScreen'

const SendIcon: React.FC<{ color?: string }> = ({ color }) => (
  <Svg x="0px" y="0px" viewBox="0 0 50 50">
    <Path
      d="M32.1,17.9v13.2l-2.3,0l0-9.3L19.6,32.1l-1.7-1.7L28,20.2l-9.3,0l0.1-2.3L32.1,17.9"
      fill={color || '#5D5E5E'}
    />
  </Svg>
)

const ReceiveButton: React.FC<{ color?: string }> = ({ color }) => (
  <Svg x="0px" y="0px" viewBox="0 0 50 50">
    <Path
      d="M17.9,32.1V18.9l2.3,0l0,9.3l10.3-10.3l1.7,1.7L22,29.8l9.3,0l-0.1,2.3L17.9,32.1"
      fill={color || '#5D5E5E'}
    />
  </Svg>
)

export const HomeScreen: React.FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <View>
      <View style={{ ...grid.row, ...styles.amountRow }}>
        <View style={grid.column6}>
          <Text style={styles.amount}>1000</Text>
        </View>
        <View style={grid.column3}>
          <SquareButton
            onPress={() => navigation.navigate('Send')}
            title="send"
            icon={<SendIcon />}
          />
        </View>
        <View style={grid.column3}>
          <SquareButton
            onPress={() => navigation.navigate('Receive')}
            title="receive"
            icon={<ReceiveButton />}
          />
        </View>
      </View>

      <View>
      </View>
      <Text>accordion section</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  amountRow: {
    padding: 25,
  },
  amount: {
    color: '#5C5D5D',
    fontSize: 36,
    fontWeight: '500',
    marginTop: 25,
  },
})
