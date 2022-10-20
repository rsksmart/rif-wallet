import React from 'react'
import Jdenticon from 'react-native-jdenticon'
import { colors } from '../../styles'

interface AvatarIconProps {
  value: string
  size?: number
  style?: any
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({
  value,
  size = 40,
  style,
}) => {
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
    backgroundColor: colors.lightPurple,
    ...style,
  }
  return (
    <Jdenticon value={value} size={size} style={iconStyle} config={config} />
  )
}
