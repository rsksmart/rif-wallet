import { ReactNode } from 'react'
import {
  GestureResponderEvent,
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { colors } from '../../styles'
import { RegularText } from '../typography'

interface Props {
  title: string
  balance: string
  icon: ReactNode
  onPress?: (event: GestureResponderEvent) => void
  testID?: string
  style?: ViewStyle
  textStyle?: TextStyle
}

export const TokenButton = ({
  title,
  balance,
  onPress,
  testID,
  style,
  icon,
}: Props) => (
  <TouchableOpacity
    style={style ? { ...styles.button, ...style } : styles.button}
    onPress={onPress}
    testID={testID}
    accessibilityLabel={title}>
    <View style={styles.iconContainer}>
      <View style={styles.icon}>{icon}</View>
      <View>
        <RegularText style={styles.titleText}> {title}</RegularText>
      </View>
    </View>
    <View style={styles.values}>
      {!!balance && (
        <RegularText style={styles.balanceText}>{balance}</RegularText>
      )}
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    fontSize: 18,
    padding: 15,
    borderRadius: 15,
    minWidth: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  balanceText: {
    color: colors.white,
    paddingTop: 7,
  },
  titleText: {
    paddingTop: 5,
    marginLeft: 5,
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
})
