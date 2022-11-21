import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

interface Interface {
  title: string
  onPress?: (event: GestureResponderEvent) => void
  disabled?: boolean
  testID?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button = ({
  title,
  onPress,
  disabled,
  testID,
  style,
  textStyle,
}: Interface) => (
  <TouchableOpacity
    style={style ? { ...styles.button, ...style } : styles.button}
    onPress={onPress}
    disabled={disabled}
    testID={testID}>
    <View>
      <Text
        style={
          disabled ? styles.textDisabled : { ...styles.text, ...textStyle }
        }>
        {title}
      </Text>
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
  textDisabled: {
    color: '#cccccc',
  },
})
