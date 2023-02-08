import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

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
