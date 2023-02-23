import Icon from 'react-native-vector-icons/Entypo'

import { AppTouchable } from 'components/appTouchable'
import { sharedColors } from 'shared/constants'

interface Props {
  onPress: () => void
  accessibilityLabel: string
}

export const BackButton = ({ onPress, accessibilityLabel }: Props) => (
  <AppTouchable
    width={30}
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}>
    <Icon name="chevron-thin-left" color={sharedColors.subTitle} size={16} />
  </AppTouchable>
)
