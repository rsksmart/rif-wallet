import { useState, useCallback, useEffect, useMemo } from 'react'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import * as Progress from 'react-native-progress'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { RnsProcessor } from 'lib/rns'

import { colors } from 'src/styles'
import { rnsManagerStyles } from './rnsManagerStyles'
import { PrimaryButton } from 'components/button/PrimaryButton'
import { MediumText } from 'components/index'
import { AvatarIcon } from 'components/icons/AvatarIcon'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
  ProfileStatus,
} from 'navigation/profileNavigator/types'
import TitleStatus from './TitleStatus'
import { ScreenWithWallet } from '../types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { requestUsername, selectProfileStatus } from 'store/slices/profileSlice'

type Props = ProfileStackScreenProps<profileStackRouteNames.RequestDomain> &
  ScreenWithWallet

export const RequestDomainScreen = ({ wallet, navigation, route }: Props) => {
  const rnsProcessor = useMemo(() => new RnsProcessor({ wallet }), [wallet])
  const dispatch = useAppDispatch()

  const { alias, duration } = route.params
  const fullAlias = alias + '.rsk'

  const [commitToRegisterInfo, setCommitToRegisterInfo] = useState('')
  const [commitToRegisterInfo2, setCommitToRegisterInfo2] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0.0)
  const status = useAppSelector(selectProfileStatus)

  useEffect(() => {
    let interval: NodeJS.Timer
    if (status === ProfileStatus.REQUESTING) {
      setProcessing(true)
      setProgress(0)
      setCommitToRegisterInfo('registering your alias...')
      setCommitToRegisterInfo2('estimated wait: 3 minutes')
      interval = setInterval(() => {
        setProgress(prev => prev + 0.005)
      }, 1000)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [status])

  const commitToRegister = useCallback(async () => {
    try {
      const response = await dispatch(
        requestUsername({ rnsProcessor, alias, duration }),
      ).unwrap()
      if (response && response === ProfileStatus.READY_TO_PURCHASE) {
        setProgress(1)
        setProcessing(false)
        setCommitToRegisterInfo(
          'Waiting period ended. You can now register your domain',
        )
        navigation.navigate(profileStackRouteNames.BuyDomain, {
          alias,
        })
      }
    } catch (e: unknown) {
      setProcessing(false)
      if (e instanceof Error) {
        setCommitToRegisterInfo(e?.message || '')
      }
      setCommitToRegisterInfo2('')
    }
  }, [alias, duration, rnsProcessor, dispatch, navigation])

  useEffect(() => {
    const response = rnsProcessor.getStatus(alias)
    if (response?.commitmentRequested) {
      commitToRegister().then()
    }
  }, [alias, commitToRegister, rnsProcessor])
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
              {processing && (
                <Progress.Bar
                  progress={progress}
                  width={Dimensions.get('window').width * 0.6}
                  color={colors.green}
                  borderColor={colors.background.secondary}
                  unfilledColor={colors.gray}
                />
              )}
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
