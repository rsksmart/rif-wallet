import { useEffect, useState } from 'react'

import { Clipboard, Image, Linking, StyleSheet, View } from 'react-native'
import { rnsManagerStyles } from './rnsManagerStyles'

import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { MediumText, SecondaryButton } from 'src/components'
import { PrimaryButton } from 'src/components/button/PrimaryButton'
import { getWalletSetting, SETTINGS } from 'src/core/config'
import { setProfile } from 'src/redux/slices/profileSlice/profileSlice'
import { selectProfile } from 'src/redux/slices/profileSlice/selector'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { ScreenWithWallet } from '../types'

export const AliasBoughtScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'AliasBought'> & ScreenWithWallet) => {
  const { alias, tx } = route.params

  const [registerDomainInfo, setRegisterDomainInfo] = useState(
    'Transaction for your alias is being processed',
  )

  const { chainId } = useAppSelector(selectActiveWallet)
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)

  const explorerUrl = getWalletSetting(
    SETTINGS.EXPLORER_ADDRESS_URL,
    chainId ?? 31,
  )

  const copyHashAndOpenExplorer = (hash: string) => {
    Clipboard.setString(hash)
    Linking.openURL(`${explorerUrl}/tx/${hash}`)
  }

  useEffect(() => {
    if (profile) {
      dispatch(setProfile({ ...profile, alias: `${alias}.rsk` }))
    }
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
