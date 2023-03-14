import { View } from 'react-native'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { MediumText } from 'components/index'
import { selectProfile } from 'store/slices/profileSlice'
import { useAppSelector } from 'store/storeUtils'

import { rnsManagerStyles } from './rnsManagerStyles'

export const PurchaseDomainScreen = () => {
  const { alias } = useAppSelector(selectProfile)

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
