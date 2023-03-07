import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import ActivityDetailsBitcoinContainer from './ActivityDetailsBitcoinContainer'
import ActivityDetailsContainer from './ActivityDetailsContainer'

export const ActivityDetailsScreen = ({
  route,
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.ActivityDetails>) => {
  const transaction = route.params
  const onBackPress = (): void => {
    navigation.goBack()
  }
  if ('isBitcoin' in transaction) {
    return (
      <ActivityDetailsBitcoinContainer
        {...transaction}
        onBackPress={onBackPress}
      />
    )
  } else {
    return (
      <ActivityDetailsContainer
        transaction={transaction}
        onBackPress={onBackPress}
      />
    )
  }
}
