import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import { sharedColors } from 'shared/constants'
// @TODO add onPress event (navigate/share/etc)
export const ContactsBarButtonGroup = () => (
  <BarButtonGroupContainer backgroundColor={sharedColors.secondary}>
    <BarButtonGroupIcon
      iconName="north-east"
      IconComponent={MaterialIcon}
      onPress={() => {}}
    />
    <BarButtonGroupIcon
      iconName="share-outline"
      IconComponent={Ionicons}
      onPress={() => {}}
    />
  </BarButtonGroupContainer>
)
