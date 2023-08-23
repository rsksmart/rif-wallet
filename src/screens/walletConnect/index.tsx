import { useContext, useEffect, useMemo, useState, ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native'

import { Typography } from 'components/index'
import { ConfirmationModal } from 'components/modal'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { selectWalletState } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'

import { DappItem } from './DappItem'
import {
  SessionStruct,
  WalletConnect2Context,
  WalletConnect2Provider,
} from './WalletConnect2Context'

const withWalletConnectProvider =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const { wallet } = useAppSelector(selectWalletState)
    return (
      <WalletConnect2Provider wallet={wallet}>
        <Component {...props} />
      </WalletConnect2Provider>
    )
  }

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>

interface WC2Session {
  key: string
  wc: SessionStruct
  name?: string
  url?: string
}

export const WalletConnectScreen = ({ route }: Props) => {
  const { t } = useTranslation()

  const {
    pendingSession,
    error: walletConnect2Error,
    setError: setWalletConnect2Error,
    sessions,
    onDisconnectSession,
    onUserApprovedSession,
    onUserRejectedSession,
    onCreateNewSession,
  } = useContext(WalletConnect2Context)
  const [disconnectingWC, setDisconnectingWC] = useState<WC2Session | null>(
    null,
  )

  /**
   * useEffect that watches when we pass data to the route params and connects user depending on WC version
   */
  useEffect(() => {
    // When data exists - handle the case
    if (route.params?.data) {
      const { data } = route.params
      if (data.includes('@2')) {
        // WalletConnect 2.0
        onCreateNewSession(data)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.data])

  const handleDisconnectSession = (mergedWc: WC2Session) => async () => {
    try {
      await onDisconnectSession(mergedWc.wc)
      setDisconnectingWC(null)
    } catch (err) {
      // @TODO handle error disconnecting
      console.log(63, 'WC2.0 error disconnect', err)
    }
  }

  /**
   * When there is an error in WC2.0 - this effect will show it to the UI
   */
  useEffect(() => {
    if (walletConnect2Error) {
      Alert.alert(t(walletConnect2Error.title), t(walletConnect2Error.message))
      setWalletConnect2Error(undefined)
    }
  }, [walletConnect2Error, t, setWalletConnect2Error])

  const onWCDisconnect = (wc: WC2Session) => () => setDisconnectingWC(wc)

  const wc2Sessions: WC2Session[] = useMemo(
    () =>
      sessions.map(session => {
        return {
          name: session.peer.metadata.name,
          url: session.peer.metadata.url,
          key: session.topic,
          wc: session,
        }
      }),
    [sessions],
  )
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.innerHeader1}>
          <Typography type="h2">{t('dapps_title')}</Typography>
          <Typography type="h5" style={styles.subtitle}>
            {t('dapps_instructions')}
          </Typography>
        </View>
        <View style={styles.innerHeader2} />
      </View>

      {wc2Sessions.length === 0 ? (
        <Image
          source={require('src/images/empty-dapps.png')}
          style={styles.noDappsImage}
        />
      ) : (
        <ScrollView style={styles.dappsList}>
          {wc2Sessions.map(session => (
            <DappItem
              key={session.key}
              name={session.name}
              url={session.url}
              isDisconnecting={session === disconnectingWC}
              onDisconnect={onWCDisconnect(session)}
            />
          ))}
        </ScrollView>
      )}

      {pendingSession ? (
        <ConfirmationModal
          isVisible
          title={t('dapps_confirmation_title')}
          description={`${t('dapps_confirmation_description')}${
            pendingSession.proposal.params.proposer.metadata.name
              ? ` ${pendingSession.proposal.params.proposer.metadata.name}`
              : ''
          }?`}
          okText={t('dapps_confirmation_button_connect')}
          cancelText={t('dapps_confirmation_button_cancel')}
          onOk={onUserApprovedSession}
          onCancel={onUserRejectedSession}
        />
      ) : null}

      {disconnectingWC ? (
        <ConfirmationModal
          isVisible={Boolean(disconnectingWC)}
          title={t('dapps_confirm_disconnection_title')}
          description={`${t('dapps_confirm_disconnection_description')}${
            disconnectingWC.name ? ` ${disconnectingWC.name}` : ''
          }?`}
          okText={t('dapps_confirm_disconnection_confirm')}
          cancelText={t('dapps_confirm_disconnection_cancel')}
          onOk={handleDisconnectSession(disconnectingWC)}
          onCancel={() => setDisconnectingWC(null)}
        />
      ) : null}
    </View>
  )
}

export const WalletConnectScreenWithProvider =
  withWalletConnectProvider(WalletConnectScreen)

const styles = StyleSheet.create({
  screen: castStyle.view({
    height: '100%',
    backgroundColor: sharedColors.secondary,
    padding: 20,
  }),
  header: castStyle.view({
    flexDirection: 'row',
    padding: 10,
  }),
  innerHeader1: castStyle.view({
    flex: 3,
  }),
  innerHeader2: castStyle.view({
    flex: 1,
  }),
  subtitle: castStyle.view({
    marginTop: 10,
  }),
  noDappsImage: castStyle.image({
    flex: 4,
    alignSelf: 'center',
    width: '80%',
    resizeMode: 'contain',
  }),
  dappsList: castStyle.view({
    flex: 1,
    marginTop: 20,
  }),
})
