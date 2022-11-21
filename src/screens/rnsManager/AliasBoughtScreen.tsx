import { useEffect, useState } from 'react'

import { Clipboard, Image, Linking, StyleSheet, View } from 'react-native'
import { rnsManagerStyles } from './rnsManagerStyles'

import { OutlineButton } from '../../components/button/ButtonVariations'

import { MediumText } from '../../components'
import { PrimaryButton2 } from '../../components/button/PrimaryButton2'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { ScreenWithWallet } from '../types'
import { IProfileStore } from 'src/storage/MainStorage'

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

  const copyHashAndOpenExplorer = (hash: string) => {
    Clipboard.setString(hash) // TODO: fix deprecated Clipboard
    Linking.openURL(`https://explorer.testnet.rsk.co/tx/${hash}`)
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
            <PrimaryButton2
              onPress={() => copyHashAndOpenExplorer(tx.hash)}
              accessibilityLabel="Copy Hash & Open Explorer"
              title={'Copy Hash & Open Explorer'}
            />
          </View>
          <OutlineButton
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
