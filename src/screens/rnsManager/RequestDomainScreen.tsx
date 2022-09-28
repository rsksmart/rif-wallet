import React, { useState, useEffect } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import * as Progress from 'react-native-progress'

import { View, Dimensions, Image, TouchableOpacity } from 'react-native'
import { colors } from '../../styles'
import { rnsManagerStyles } from './rnsManagerStyles'

import { PurpleButton } from '../../components/button/ButtonVariations'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import { MediumText } from '../../components'
import addresses from './addresses.json'
import TitleStatus from './TitleStatus'

type Props = {
  route: any
}

export const RequestDomainScreen: React.FC<
  ScreenProps<'RequestDomain'> & ScreenWithWallet & Props
> = ({ wallet, navigation, route }) => {
  const { alias, duration } = route.params

  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )
  const [commitToRegisterInfo, setCommitToRegisterInfo] = useState('')
  const [commitToRegisterInfo2, setCommitToRegisterInfo2] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0.0)

  const commitToRegister = async () => {
    setProcessing(true)
    try {
      const { makeCommitmentTransaction, secret, canReveal } =
        await rskRegistrar.commitToRegister(alias, wallet.smartWallet.address)

      setCommitToRegisterInfo('registering your alias...')
      setCommitToRegisterInfo2('estimated wait: 3 minutes')

      const intervalId = setInterval(async () => {
        const ready = await canReveal()
        setProgress(prev => prev + 0.009)
        if (ready) {
          setProcessing(false)
          navigation.navigate('BuyDomain', {
            navigation,
            alias,
            domainSecret: secret,
            duration,
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
      <View style={rnsManagerStyles.profileHeader}>
        {/*@ts-ignore*/}
        <TouchableOpacity onPress={() => navigation.navigate('SearchDomain')}>
          <View style={rnsManagerStyles.backButton}>
            <MaterialIcon name="west" color="white" size={10} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={rnsManagerStyles.container}>
        <TitleStatus
          title={'Request alias'}
          subTitle={'next: Purchase Alias'}
          progress={0.59}
          progressText={'2/4'}
        />
        <View style={rnsManagerStyles.marginBottom}>
          <View style={rnsManagerStyles.profileImageContainer}>
            <Image
              style={rnsManagerStyles.profileImage}
              source={require('../../images/image_place_holder.jpeg')}
            />
            <View>
              <MediumText style={rnsManagerStyles.profileDisplayAlias}>
                {alias}.rsk
              </MediumText>
              <Progress.Bar
                progress={progress}
                width={Dimensions.get('window').width * 0.6}
                color={colors.green}
                borderColor={colors.background.secondary}
                unfilledColor={colors.gray}
              />
              <MediumText style={rnsManagerStyles.aliasRequestInfo}>
                {commitToRegisterInfo}
              </MediumText>
              <MediumText style={rnsManagerStyles.aliasRequestInfo2}>
                {commitToRegisterInfo2}
              </MediumText>
            </View>
          </View>
        </View>

        <View style={rnsManagerStyles.bottomContainer}>
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
