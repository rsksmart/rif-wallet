import { TextStyle } from 'react-native'
import Jdenticon from 'react-native-jdenticon'

import { sharedColors } from 'shared/constants'
interface AvatarIconProps {
  value: string
  size?: number
  style?: TextStyle
}

export const AvatarIcon = ({ value, size = 40, style }: AvatarIconProps) => {
  const config = {
    lightness: {
      color: [0.4, 0.8],
      grayscale: [0.3, 0.6],
    },
    saturation: {
      color: 0.7,
      grayscale: 0.5,
    },
    padding: 0.15,
  }
  const iconStyle = {
    borderRadius: 50,
    backgroundColor: sharedColors.secondary,
    ...style,
  }
  return (
    <Jdenticon value={value} size={size} style={iconStyle} config={config} />
  )
}
