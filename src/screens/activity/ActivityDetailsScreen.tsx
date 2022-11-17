import React from 'react'
import { IActivityTransaction } from './types'
import { RootStackNavigationProp } from 'navigation/rootNavigator/types'
import ActivityDetailsBitcoinContainer from './ActivityDetailsBitcoinContainer'
import ActivityDetailsContainer from './ActivityDetailsContainer'

export type ActivityDetailsScreenProps = {
  route: { params: IActivityTransaction }
  navigation: RootStackNavigationProp
}
export const ActivityDetailsScreen: React.FC<ActivityDetailsScreenProps> = ({
  route,
  navigation,
}) => {
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
