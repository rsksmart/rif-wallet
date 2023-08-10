import { useIsFocused } from '@react-navigation/native'
import WalletConnect from '@walletconnect/client'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

import { Typography } from 'components/index'
import { ConfirmationModal } from 'components/modal'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { deleteWCSession } from 'storage/WalletConnectSessionStore'
import { changeTopColor, selectWalletState } from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'

import { DappItem } from './DappItem'
import {
  WalletConnectContext,
  WalletConnectProviderElement,
} from './WalletConnectContext'

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>

export const WalletConnectScreen = ({ route }: Props) => {
  const dispatch = useAppDispatch()
  const { wallet } = useAppSelector(selectWalletState)
  const isFocused = useIsFocused()
  const wcKey = route.params?.wcKey

  const { t } = useTranslation()
  const { connections, handleApprove, handleReject } =
    useContext(WalletConnectContext)
  const [disconnectingWC, setDisconnectingWC] = useState<WalletConnect | null>(
    null,
  )

  const openedConnections = Object.values(connections).filter(
    ({ connector: c }) => c.connected,
  )

  const pendingConnector = wcKey ? connections[wcKey]?.connector : null

  const handleDisconnectSession = (wc: WalletConnect) => async () => {
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

  useEffect(() => {
    if (isFocused) {
      dispatch(changeTopColor(sharedColors.secondary))
    }
  }, [dispatch, isFocused])

  return (
    <WalletConnectProviderElement>
      <View style={sharedStyles.container}>
        <View style={styles.header}>
          <View style={styles.innerHeader1}>
            <Typography type="h2">{t('dapps_title')}</Typography>
            <Typography type="h5" style={styles.subtitle}>
              {t('dapps_instructions')}
            </Typography>
          </View>
          <View style={styles.innerHeader2} />
        </View>

        {openedConnections.length === 0 ? (
          <>
            <Image
              source={require('src/images/empty-dapps.png')}
              style={styles.noDappsImage}
            />
          </>
        ) : (
          <ScrollView style={styles.dappsList}>
            {openedConnections.map(({ connector: c }) => (
              <DappItem
                key={c.key}
                connector={c}
                isDisconnecting={c.key === disconnectingWC?.key}
                onDisconnect={() => setDisconnectingWC(c)}
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

        {disconnectingWC ? (
          <ConfirmationModal
            isVisible={Boolean(disconnectingWC)}
            title={t('dapps_confirm_disconnection_title')}
            description={`${t('dapps_confirm_disconnection_description')}${
              disconnectingWC.peerMeta?.name
                ? ` ${disconnectingWC.peerMeta?.name}`
                : ''
            }?`}
            okText={t('dapps_confirm_disconnection_confirm')}
            cancelText={t('dapps_confirm_disconnection_cancel')}
            onOk={handleDisconnectSession(disconnectingWC)}
            onCancel={() => setDisconnectingWC(null)}
          />
        ) : null}
      </View>
    </WalletConnectProviderElement>
  )
}

const styles = StyleSheet.create({
  header: castStyle.view({
    flexDirection: 'row',
    marginTop: 18,
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
