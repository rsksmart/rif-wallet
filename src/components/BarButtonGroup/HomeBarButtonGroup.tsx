import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
// @TODO add onPress event (navigate/share/etc)
export const HomeBarButtonGroup = () => (
  <BarButtonGroupContainer>
    <BarButtonGroupIcon
      iconName="south-west"
      IconComponent={MaterialIcon}
      onPress={() => {}}
    />
    <BarButtonGroupIcon
      iconName="north-east"
      IconComponent={MaterialIcon}
      onPress={() => {}}
    />
    <BarButtonGroupIcon
      iconName="plus"
      IconComponent={MaterialCommunityIcon}
      onPress={() => {}}
    />
  </BarButtonGroupContainer>
)
