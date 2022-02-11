import React from 'react'
import {
  GestureResponderEvent,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native'

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
    <View style={styles.contentWrapper}>
      <View>{!!icon && icon}</View>
      <View>
        <Text style={{ ...styles.text, ...textStyle }}>{title}</Text>
        {!!balance && <Text>{balance}</Text>}
      </View>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    fontSize: 18,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#575757',
    borderWidth: 4,
    minWidth: 100,
  },
  text: {
    color: '#575757',
  },
  contentWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
})
