import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { useEffect, useState } from 'react'
import * as Progress from 'react-native-progress'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { Dimensions, TouchableOpacity, View } from 'react-native'
import { colors } from '../../styles'
import { rnsManagerStyles } from './rnsManagerStyles'

import { PrimaryButton2 } from '../../components/button/PrimaryButton2'

import { MediumText } from '../../components'
import { AvatarIcon } from '../../components/icons/AvatarIcon'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { ScreenWithWallet } from '../types'
import addresses from './addresses.json'
import TitleStatus from './TitleStatus'

type Props = RootStackScreenProps<rootStackRouteNames.RequestDomain> &
  ScreenWithWallet

export const RequestDomainScreen = ({ wallet, navigation, route }: Props) => {
  const { alias, duration } = route.params
  const fullAlias = alias + '.rsk'

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
          navigation.navigate(rootStackRouteNames.BuyDomain, {
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
    } catch (e: unknown) {
      setProcessing(false)
      setCommitToRegisterInfo(e?.message || '')
      setCommitToRegisterInfo2('')
    }
  }
  useEffect(() => {
    commitToRegister().then()
  }, [])
  return (
    <>
      <View style={rnsManagerStyles.profileHeader}>
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
            <AvatarIcon value={fullAlias} size={80} />
            <View>
              <MediumText style={rnsManagerStyles.profileDisplayAlias}>
                {fullAlias}
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
          <PrimaryButton2
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
