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
  route: any
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
  const [commitToRegisterInfo2, setCommitToRegisterInfo2] = useState('')
  const [processing, setProcessing] = useState(false)
  const [domainSecret, setDomainSecret] = useState('')
  const [progress, setProgress] = useState(0.0)

  const commitToRegister = async () => {
    setProcessing(true)
    try {
      const { makeCommitmentTransaction, secret, canReveal } =
        await rskRegistrar.commitToRegister(
          alias.replace('.rsk', ''),
          wallet.smartWallet.address,
        )

      setDomainSecret(secret)
      setCommitToRegisterInfo('registering your alias...')
      setCommitToRegisterInfo2('estimated wait: 3 minutes')

      const intervalId = setInterval(async () => {
        const ready = await canReveal()
        setProgress(prev => prev + 0.015)
        if (ready) {
          setProcessing(false)
          navigation.navigate('BuyDomain', {
            navigation,
            alias,
            domainSecret,
          })
          setCommitToRegisterInfo(
            'Waiting period ended. You can now register your domain',
          )
          clearInterval(intervalId)
        }
      }, 1000)
      await makeCommitmentTransaction.wait()
      setCommitToRegisterInfo('Transaction confirmed. Please wait...')
    } catch (e: any) {
      setProcessing(false)
      setCommitToRegisterInfo(e.message)
      setCommitToRegisterInfo2('')
    }
  }
  useEffect(() => {
    commitToRegister().then()
  }, [])
  return (
    <>
      <View style={styles.profileHeader}>
        {/*@ts-ignore*/}
        <TouchableOpacity onPress={() => navigation.navigate('SearchDomain')}>
          <View style={styles.backButton}>
            <MaterialIcon name="west" color="white" size={10} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <TitleStatus
          title={'Request alias'}
          subTitle={'next: Purchase Alias'}
          progress={0.59}
          progressText={'2/5'}
        />
        <View style={styles.marginBottom}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={require('../../images/image_place_holder.jpeg')}
            />
            <View>
              <MediumText style={styles.profileDisplayAlias}>
                {alias}
              </MediumText>
              <Progress.Bar
                progress={progress}
                width={Dimensions.get('window').width * 0.6}
                style={styles.progressBar}
                color={colors.green}
                borderColor={colors.background.secondary}
                unfilledColor={colors.gray}
              />
              <MediumText style={styles.aliasRequestInfo}>
                {commitToRegisterInfo}
              </MediumText>
              <MediumText style={styles.aliasRequestInfo2}>
                {commitToRegisterInfo2}
              </MediumText>
            </View>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <PurpleButton
            onPress={() => commitToRegister()}
            accessibilityLabel="request"
            title={'request'}
            disabled={processing}
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
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  profileDisplayAlias: {
    color: colors.white,
    padding: 10,
    alignSelf: 'center',
    fontSize: 18,
  },
  aliasRequestInfo: {
    color: colors.white,
    alignSelf: 'center',
    padding: 5,
    paddingTop: 10,
  },
  aliasRequestInfo2: {
    color: colors.gray,
    alignSelf: 'center',
    padding: 5,
  },
  marginBottom: {
    marginBottom: 10,
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
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
})
