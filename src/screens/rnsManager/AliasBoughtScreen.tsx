import { useEffect, useState } from 'react'

import { Clipboard, Image, Linking, StyleSheet, View } from 'react-native'
import { rnsManagerStyles } from './rnsManagerStyles'

import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { SecondaryButton } from 'src/components/button/SecondaryButton'
import { MediumText } from 'src/components'
import { PrimaryButton } from 'src/components/button/PrimaryButton'
import { IProfileStore } from 'src/storage/MainStorage'
import { ScreenWithWallet } from '../types'
import { getWalletSetting, SETTINGS } from 'src/core/config'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'

interface Props {
  profile: IProfileStore
  setProfile: (p: IProfileStore) => void
}

export const AliasBoughtScreen = ({
  profile,
  setProfile,
  navigation,
  route,
}: RootStackScreenProps<'AliasBought'> & ScreenWithWallet & Props) => {
  const { alias, tx } = route.params

  const [registerDomainInfo, setRegisterDomainInfo] = useState(
    'Transaction for your alias is being processed',
  )

  const { chainId } = useAppSelector(selectActiveWallet)
  const explorerUrl = getWalletSetting(SETTINGS.EXPLORER_ADDRESS_URL, chainId)

  const copyHashAndOpenExplorer = (hash: string) => {
    Clipboard.setString(hash)
    Linking.openURL(`${explorerUrl}/tx/${hash}`)
  }

  useEffect(() => {
    setProfile({
      ...profile,
      alias,
    })
    const fetchData = async () => {
      await tx.wait()
      setRegisterDomainInfo('Your alias has been registered successfully')
    }
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [])

  return (
    <>
      <View style={rnsManagerStyles.container}>
        <View style={rnsManagerStyles.marginBottom}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={require('../../images/AliasBought.png')}
            />
            <View>
              <MediumText style={rnsManagerStyles.aliasRequestInfo}>
                Congratulations
              </MediumText>
              <MediumText style={rnsManagerStyles.aliasRequestInfo}>
                {registerDomainInfo}
              </MediumText>
            </View>
          </View>
        </View>

        <View style={rnsManagerStyles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <PrimaryButton
              onPress={() => copyHashAndOpenExplorer(tx.hash)}
              accessibilityLabel="Copy Hash & Open Explorer"
              title={'Copy Hash & Open Explorer'}
            />
          </View>
          <SecondaryButton
            onPress={() =>
              navigation.navigate(rootStackRouteNames.ProfileDetailsScreen)
            }
            accessibilityLabel="close"
            title={'Close'}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  image: {
    paddingTop: 50,
    paddingBottom: 10,
  },
  buttonContainer: {
    marginBottom: 15,
  },
})
