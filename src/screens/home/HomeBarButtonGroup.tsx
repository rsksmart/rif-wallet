import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import {
  BarButtonGroupContainer,
  BarButtonGroupIcon,
} from 'components/BarButtonGroup/BarButtonGroup'

interface HomeBarButtonGroupProps {
  onPress: (decision: 'SEND' | 'RECEIVE' | 'FAUCET') => void
  isSendDisabled: boolean
}
export const HomeBarButtonGroup = ({
  onPress,
  isSendDisabled,
}: HomeBarButtonGroupProps) => (
  <BarButtonGroupContainer>
    <BarButtonGroupIcon
      iconName="south-west"
      IconComponent={MaterialIcon}
      onPress={() => onPress('RECEIVE')}
    />
    <BarButtonGroupIcon
      iconName="north-east"
      IconComponent={MaterialIcon}
      onPress={() => {
        if (!isSendDisabled) {
          onPress('SEND')
        }
      }}
    />
    <BarButtonGroupIcon
      iconName="plus"
      IconComponent={MaterialCommunityIcon}
      onPress={() => onPress('FAUCET')}
    />
  </BarButtonGroupContainer>
)
