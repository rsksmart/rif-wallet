import { useEffect, useState, useCallback } from 'react'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import * as Progress from 'react-native-progress'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { colors } from 'src/styles'
import { rnsManagerStyles } from './rnsManagerStyles'
import { PrimaryButton } from 'components/button/PrimaryButton'
import { MediumText } from 'components/index'
import { AvatarIcon } from 'components/icons/AvatarIcon'
import { IProfileRegistrationStore } from 'storage/AliasRegistrationStore'
import { useAliasRegistration } from 'core/hooks/useAliasRegistration'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import TitleStatus from './TitleStatus'
import { ScreenWithWallet } from '../types'

type Props = ProfileStackScreenProps<profileStackRouteNames.RequestDomain> &
  ScreenWithWallet

export const RequestDomainScreen = ({ wallet, navigation, route }: Props) => {
  const {
    registrationStarted,
    readyToRegister,
    getRegistrationData,
    setRegistrationData,
  } = useAliasRegistration(wallet)
  const { alias, duration } = route.params
  const fullAlias = alias + '.rsk'

  const [commitToRegisterInfo, setCommitToRegisterInfo] = useState('')
  const [commitToRegisterInfo2, setCommitToRegisterInfo2] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0.0)

  const getUpToDateRegistrationData = useCallback(async () => {
    if (await registrationStarted()) {
      setCommitToRegisterInfo('loading registration process status')
      setProgress(0.3)
      return await getRegistrationData()
    } else {
      setCommitToRegisterInfo('committing to register...')
      setProgress(0)
      return await setRegistrationData(alias, parseInt(duration, 10))
    }
  }, [
    alias,
    duration,
    getRegistrationData,
    registrationStarted,
    setRegistrationData,
  ])

  const commitToRegister = useCallback(async () => {
    setProcessing(true)
    try {
      const profileRegistrationStore: IProfileRegistrationStore =
        await getUpToDateRegistrationData()
      setCommitToRegisterInfo('registering your alias...')
      setCommitToRegisterInfo2('estimated wait: 3 minutes')
      const intervalId = setInterval(async () => {
        setProgress(prev => prev + 0.009)
        const ready = await readyToRegister(
          profileRegistrationStore.commitToRegisterHash,
        )
        if (ready) {
          setProgress(1)
          setProcessing(false)
          navigation.navigate(profileStackRouteNames.BuyDomain, {
            alias,
            domainSecret: profileRegistrationStore.commitToRegisterSecret,
            duration,
          })
          setCommitToRegisterInfo(
            'Waiting period ended. You can now register your domain',
          )
          clearInterval(intervalId)
        }
      }, 1000)
    } catch (e: unknown) {
      setProcessing(false)
      setCommitToRegisterInfo(e?.message || '')
      setCommitToRegisterInfo2('')
    }
  }, [
    alias,
    navigation,
    duration,
    getUpToDateRegistrationData,
    readyToRegister,
  ])

  useEffect(() => {
    commitToRegister().then()
  }, [commitToRegister])

  return (
    <>
      <View style={rnsManagerStyles.profileHeader}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(profileStackRouteNames.SearchDomain)
          }
          accessibilityLabel="back">
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
          <PrimaryButton
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
