import WalletConnect from '@walletconnect/client'
import { useContext, useEffect, useMemo, useState } from 'react'
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
import { deleteWCSession } from 'storage/WalletConnectSessionStore'
import { selectWalletState } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'

import { DappItem } from './DappItem'
import {
  WalletConnectContext,
  WalletConnectProviderElement,
} from './WalletConnectContext'
import {
  SessionStruct,
  WalletConnect2Context,
  WalletConnect2Provider,
} from './WalletConnect2Context'

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>

interface MergedWCSession {
  key: string
  wc: WalletConnect | SessionStruct
  name?: string
  url?: string
}

export const WalletConnectScreen = ({ route }: Props) => {
  const { wallet } = useAppSelector(selectWalletState)
  const wcKey = route.params?.wcKey

  const { t } = useTranslation()
  const { connections, handleApprove, handleReject } =
    useContext(WalletConnectContext)
  const {
    pendingSession,
    error: walletConnect2Error,
    setError: setWalletConnect2Error,
    sessions,
    onDisconnectSession,
    onUserApprovedSession,
    onUserRejectedSession,
  } = useContext(WalletConnect2Context)
  const [disconnectingWC, setDisconnectingWC] =
    useState<MergedWCSession | null>(null)

  const openedConnections = useMemo(
    () => Object.values(connections).filter(({ connector: c }) => c.connected),
    [connections],
  )

  const pendingConnector = wcKey ? connections[wcKey]?.connector : null

  const handleDisconnectSession = (mergedWc: MergedWCSession) => async () => {
    if ('topic' in mergedWc.wc) {
      try {
        await onDisconnectSession(mergedWc.wc)
        setDisconnectingWC(null)
      } catch (err) {
        // @TODO handle error disconnecting
        console.log(63, 'WC2.0 error disconnect', err)
      }
    } else {
      const { wc } = mergedWc
      try {
        const key = wc.key
        await wc.killSession()
        deleteWCSession(key)
        setDisconnectingWC(null)
      } catch (err) {
        // Error disconnecting session
        if (err instanceof Error || typeof err === 'string') {
          console.log(53, err.toString())
        }
      }
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

  const onWCDisconnect = (wc: MergedWCSession) => () => setDisconnectingWC(wc)

  const mergedWalletConnectSessions: MergedWCSession[] = useMemo(
    () =>
      [...openedConnections, ...sessions].map(session => {
        if ('connector' in session) {
          return {
            name: session.connector.peerMeta?.name,
            url: session.connector.peerMeta?.url,
            key: session.connector.key,
            wc: session.connector,
          }
        } else {
          return {
            name: session.peer.metadata.name,
            url: session.peer.metadata.url,
            key: session.topic,
            wc: session,
          }
        }
      }),
    [openedConnections, sessions],
  )
  return (
    <WalletConnectProviderElement>
      <WalletConnect2Provider wallet={wallet}>
        <View style={styles.parent}>
          <View style={styles.header}>
            <View style={styles.innerHeader1}>
              <Typography type="h2">{t('dapps_title')}</Typography>
              <Typography type="h5" style={styles.subtitle}>
                {t('dapps_instructions')}
              </Typography>
            </View>
            <View style={styles.innerHeader2} />
          </View>

          {mergedWalletConnectSessions.length === 0 ? (
            <>
              <Image
                source={require('src/images/empty-dapps.png')}
                style={styles.noDappsImage}
              />
            </>
          ) : (
            <ScrollView style={styles.dappsList}>
              {mergedWalletConnectSessions.map(session => (
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

          {pendingConnector ? (
            <ConfirmationModal
              isVisible={!pendingConnector.connected}
              title={t('dapps_confirmation_title')}
              description={`${t('dapps_confirmation_description')}${
                pendingConnector.peerMeta?.name
                  ? ` ${pendingConnector.peerMeta?.name}`
                  : ''
              }?`}
              okText={t('dapps_confirmation_button_connect')}
              cancelText={t('dapps_confirmation_button_cancel')}
              onOk={() => handleApprove(pendingConnector, wallet)}
              onCancel={() => handleReject(pendingConnector)}
            />
          ) : null}

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
      </WalletConnect2Provider>
    </WalletConnectProviderElement>
  )
}

const styles = StyleSheet.create({
  parent: castStyle.view({
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
