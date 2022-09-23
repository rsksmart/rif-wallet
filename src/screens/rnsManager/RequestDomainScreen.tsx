import React, { useState, useEffect } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import * as Progress from 'react-native-progress'

import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native'
import { colors } from '../../styles'
import { PurpleButton } from '../../components/button/ButtonVariations'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import { MediumText } from '../../components'
import { IProfileStore } from '../../storage/ProfileStore'
import addresses from './addresses.json'
import TitleStatus from './TitleStatus'

type Props = {
  profile: IProfileStore
  setProfile: (p: IProfileStore) => void
}

export const RequestDomainScreen: React.FC<
  ScreenProps<'RequestDomain'> & ScreenWithWallet & Props
> = ({ wallet, navigation, route }) => {
  const { alias } = route.params

  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )
  const [commitToRegisterInfo, setCommitToRegisterInfo] = useState('')
  const [domainSecret, setDomainSecret] = useState('')
  const [commitReady, setCommitReady] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0.1)

  const commitToRegister = async () => {
    try {
      const { makeCommitmentTransaction, secret, canReveal } =
        await rskRegistrar.commitToRegister(
          'moonwalker_game',
          wallet.smartWallet.address,
        )

      setDomainSecret(secret)
      setCommitToRegisterInfo('Transaction sent. Please wait...')

      await makeCommitmentTransaction.wait()

      setCommitToRegisterInfo(
        'Transaction confirmed. Please wait approximately 2 mins to secure your domain',
      )

      const intervalId = setInterval(async () => {
        const ready = await canReveal()
        setProgress(prev => prev + 0.02)
        if (ready) {
          navigation.navigate('BuyDomain', {
            navigation,
            alias,
          })
          setCommitToRegisterInfo(
            'Waiting period ended. You can now register your domain',
          )
          setCommitReady(true)
          clearInterval(intervalId)
        }
      }, 1000)
    } catch (e: any) {
      setError(e.message)
    }
  }
  useEffect(() => {
    commitToRegister().then()
  }, [])
  return (
    <>
      <View>
        <MediumText>{commitToRegisterInfo}</MediumText>
      </View>
      <View style={styles.profileHeader}>
        {/*@ts-ignore*/}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={styles.backButton}>
            <MaterialIcon name="west" color="white" size={10} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <TitleStatus title={'Request alias'} />

        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={require('../../images/image_place_holder.jpeg')}
          />
          <MediumText style={{ color: 'white' }}>{alias}</MediumText>
        </View>
        <View style={{}}>
          <Progress.Bar
            progress={progress}
            width={Dimensions.get('window').width * 0.8}
            style={styles.progressBar}
          />
        </View>
        <View style={styles.rowContainer}>
          <PurpleButton
            onPress={() => commitToRegister()}
            accessibilityLabel="request"
            title={'request'}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.background.darkBlue,
  },
  progressBar: {},

  backButton: {
    color: colors.white,
    backgroundColor: colors.blue2,
    borderRadius: 20,
    padding: 10,
    bottom: 3,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },

  rowContainer: {
    margin: 5,
  },
  flexContainer: {
    flexDirection: 'row',
  },
  priceContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 15,
    width: '100%',
    padding: 15,
  },
  priceText: {
    color: 'white',
  },
  addIcon: {
    right: 60,
    top: 15,
    backgroundColor: 'gray',
    height: 20,
    borderRadius: 20,
  },
  minusIcon: {
    right: 50,
    top: 15,
    backgroundColor: 'gray',
    height: 20,
    borderRadius: 20,
  },
})
