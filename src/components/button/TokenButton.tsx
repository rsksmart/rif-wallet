import React from 'react'
import {
  GestureResponderEvent,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { colors } from '../../styles/colors'

interface Props {
  title: string
  balance: string
  icon: React.ReactNode
  onPress?: (event: GestureResponderEvent) => any
  testID?: string
  style?: any
  textStyle?: any
}

export const TokenButton: React.FC<Props> = ({
  title,
  balance,
  onPress,
  testID,
  style,
  textStyle,
  icon,
}) => (
  <TouchableOpacity
    style={style ? { ...styles.button, ...style } : styles.button}
    onPress={onPress}
    testID={testID}>
    <View style={styles.iconContainer}>
      <View style={styles.icon}>
        <Text>{!!icon && icon}</Text>
      </View>
      <View>
        <Text style={styles.titleText}> {title}</Text>
      </View>
    </View>
    <View style={styles.values}>
      {!!balance && <Text style={styles.balanceText}>{balance}</Text>}
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    fontSize: 18,
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  balanceText: {
    color: colors.white,
    fontWeight: 'bold',
    paddingTop: 7,
  },
  titleText: {
    paddingTop: 7,
    fontWeight: 'bold',
    color: colors.white,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    borderRadius: 15,
    padding: 5,
    backgroundColor: colors.white,
  },
  values: {
    flexDirection: 'row',
  },
  contentWrapper: {},
})
