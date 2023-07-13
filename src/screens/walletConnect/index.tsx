import WalletConnect from '@walletconnect/client'
import { useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

import { Typography } from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { deleteWCSession } from 'storage/WalletConnectSessionStore'
import { ConfirmationModal } from 'components/modal'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'

import { DappItem } from './DappItem'
import { WalletConnectContext } from './WalletConnectContext'

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>

export const WalletConnectScreen = ({ route }: Props) => {
  const { wallet } = useAppSelector(selectActiveWallet)
  const wcKey = route.params?.wcKey

  const { t } = useTranslation()
  const { connections, handleApprove, handleReject } =
    useContext(WalletConnectContext)
  const [disconnectingWC, setDisconnectingWC] = useState<WalletConnect | null>(
    null,
  )

  const openedConnections = useMemo(
    () => Object.values(connections).filter(({ connector: c }) => c.connected),
    [connections],
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

  return (
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
