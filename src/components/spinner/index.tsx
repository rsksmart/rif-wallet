import { CircleSnail, CircleSnailPropTypes } from 'react-native-progress'

import { sharedColors } from 'shared/constants'

interface Props extends CircleSnailPropTypes {
  size: number
}

export const AppSpinner = ({
  size,
  color = sharedColors.white,
  thickness = size / 7,
  ...props
}: Props) => {
  return (
    <CircleSnail
      size={size}
      thickness={thickness}
      strokeCap={'square'}
      indeterminate={true}
      color={color}
      direction={'clockwise'}
      {...props}
    />
  )
}
