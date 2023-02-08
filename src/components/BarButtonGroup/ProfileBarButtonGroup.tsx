import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
// @TODO add onPress event (navigate/share/etc)
export const ProfileBarButtonGroup = () => (
  <BarButtonGroupContainer>
    <BarButtonGroupIcon
      iconName="qrcode"
      IconComponent={AntDesign}
      onPress={() => {}}
    />
    <BarButtonGroupIcon
      iconName="share-outline"
      IconComponent={Ionicons}
      onPress={() => {}}
    />
  </BarButtonGroupContainer>
)
