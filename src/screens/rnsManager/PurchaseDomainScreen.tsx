import { View } from 'react-native'
import { useCallback, useEffect } from 'react'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { MediumText } from 'components/index'
import { selectProfile } from 'store/slices/profileSlice'
import { useAppSelector } from 'store/storeUtils'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'

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
        <AvatarIcon value={alias} size={80} />

        <View>
          <MediumText style={rnsManagerStyles.profileDisplayAlias}>
            {alias}
          </MediumText>
        </View>
      </View>
    </View>
  )
}
