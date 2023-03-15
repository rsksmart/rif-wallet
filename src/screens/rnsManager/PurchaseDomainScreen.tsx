import { useCallback, useEffect } from 'react'
import { View } from 'react-native'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { Typography } from 'components/index'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { selectProfile } from 'store/slices/profileSlice'
import { useAppSelector } from 'store/storeUtils'

import { rnsManagerStyles } from './rnsManagerStyles'

type Props = ProfileStackScreenProps<profileStackRouteNames.PurchaseDomain>

export const PurchaseDomainScreen = ({ navigation }: Props) => {
  const { alias } = useAppSelector(selectProfile)

  const onBackPress = useCallback(() => navigation.goBack(), [navigation])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(onBackPress),
    })
  }, [navigation, onBackPress])

  return (
    <View style={rnsManagerStyles.container}>
      <View style={rnsManagerStyles.profileImageContainer}>
        <AvatarIcon value={alias} size={100} />

        <Typography type="h3" style={rnsManagerStyles.profileDisplayAlias}>
          {alias}
        </Typography>
      </View>
    </View>
  )
}
