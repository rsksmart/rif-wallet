import { TextStyle } from 'react-native'
import Jdenticon from 'react-native-jdenticon'

import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

interface Props {
  value: string
  size?: number
  style?: TextStyle
}

export const AvatarIcon = ({ value, size = 40, style }: Props) => {
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
  const iconStyle = castStyle.view({
    borderRadius: size / 2,
    backgroundColor: sharedColors.secondary,
  })
  return (
    <Jdenticon
      value={value}
      size={size}
      style={[iconStyle, style]}
      config={config}
    />
  )
}
