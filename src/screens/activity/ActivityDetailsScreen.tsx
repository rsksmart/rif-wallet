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
  if ('isBitcoin' in transaction) {
    return (
      <ActivityDetailsBitcoinContainer
        {...transaction}
        onBackPress={navigation.goBack}
      />
    )
  } else {
    return (
      <ActivityDetailsContainer
        transaction={transaction}
        onBackPress={navigation.goBack}
      />
    )
  }
}
