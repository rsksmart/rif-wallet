import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Svg, Path } from 'react-native-svg'
import { SendButton } from '../../components/button/SendButton'
import { ReceiveButton } from '../../components/button/ReceiveButton'
import { grid } from '../../styles/grid'

export const HomeScreen: React.FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <View>
      <View style={{ ...grid.row, ...styles.amountRow }}>
        <View style={grid.column6}>
          <Text style={styles.amount}>1000</Text>
        </View>
        <View style={grid.column3}>
          <SendButton
            onPress={() => navigation.navigate('Send')}
            title="send"
          />
        </View>
        <View style={grid.column3}>
          <ReceiveButton
            onPress={() => navigation.navigate('Receive')}
            title="receive"
          />
        </View>
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
