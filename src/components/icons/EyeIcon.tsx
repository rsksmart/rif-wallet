import Icon from 'react-native-vector-icons/FontAwesome5'
import { IconProps } from 'react-native-vector-icons/Icon'

import { defaultIconSize, sharedColors } from 'src/shared/constants'

interface Props extends Omit<IconProps, 'name'> {
  isHidden: boolean
  name?: string
}

export const EyeIcon = ({
  isHidden,
  size = defaultIconSize,
  color = sharedColors.text.primary,
}: Props) => {
  return (
    <Icon name={isHidden ? 'eye-slash' : 'eye'} size={size} color={color} />
  )
}
