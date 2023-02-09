import { useState, useCallback, useEffect, useMemo } from 'react'
import { Dimensions, TouchableOpacity, View } from 'react-native'
import * as Progress from 'react-native-progress'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { colors } from 'src/styles'
import { rnsManagerStyles } from './rnsManagerStyles'
import { PrimaryButton } from 'components/button/PrimaryButton'
import { MediumText } from 'components/index'
import { AvatarIcon } from 'components/icons/AvatarIcon'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import TitleStatus from './TitleStatus'
import { ScreenWithWallet } from '../types'
import { RnsProcessor } from 'lib/rns/RnsProcessor'
import { useAppDispatch } from 'store/storeUtils'
import { requestUsername } from 'store/slices/profileSlice'

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

  const commitToRegister = useCallback(async () => {
    try {
      setProcessing(true)
      setCommitToRegisterInfo('registering your alias...')
      setCommitToRegisterInfo2('estimated wait: 3 minutes')
      const interval = setInterval(() => {
        setProgress(prev => prev + 0.005)
      }, 1000)
      await dispatch(requestUsername({ rnsProcessor, alias, duration })).then(
        () => {
          setProgress(1)
          clearInterval(interval)
          setProcessing(false)
          setCommitToRegisterInfo(
            'Waiting period ended. You can now register your domain',
          )
          navigation.navigate(profileStackRouteNames.BuyDomain, {
            alias,
          })
        },
      )
    } catch (e: unknown) {
      setProcessing(false)
      setCommitToRegisterInfo(e?.message || '')
      setCommitToRegisterInfo2('')
    }
  }, [alias, duration, navigation, rnsProcessor, dispatch])

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
