import { ColorValue, StyleProp, StyleSheet, TextStyle } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { sharedStyles } from 'src/shared/constants'
import { castStyle } from 'src/shared/utils'

interface Props {
  size: number
  color: ColorValue
  style?: StyleProp<TextStyle>
}

export const DollarIcon = ({ size, color, style }: Props) => {
  return (
    <Icon
      style={[sharedStyles.contentCenter, sharedStyles.textCenter, style]}
      size={size}
      name={'logo-usd'}
      color={color}
    />
  )
}
