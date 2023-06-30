import WalletConnect from '@walletconnect/client'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

import { Typography } from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { ConfirmationModal } from 'components/modal'

// import { DappConnectConfirmation } from './DappConnectConfirmation'
// import { DappDisconnectConfirmation } from './DappDisconnectConfirmation'
import { DappItem } from './DappItem'
import { WalletConnectContext } from './WalletConnectContext'
import { ScreenWithWallet } from '../types'

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect> &
  ScreenWithWallet

export const WalletConnectScreen = ({ navigation, route, wallet }: Props) => {
  const pendingConnector = route.params?.pendingConnector

  const { t } = useTranslation()
  const { connections, handleApprove, handleReject } =
    useContext(WalletConnectContext)
  const [disconnectingWC, setDisconnectingWC] = useState<WalletConnect | null>(
    null,
  )

  const onClearPendingConnector = useCallback(() => {
    navigation.setParams({ pendingConnector: undefined })
  }, [navigation])

  useEffect(() => {
    if (pendingConnector?.connected) {
      onClearPendingConnector()
    }
  }, [pendingConnector, onClearPendingConnector])

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

      {Object.values(connections).length === 0 ? (
        <>
          <Image
            source={require('src/images/empty-dapps.png')}
            style={styles.noDappsImage}
          />
        </>
      ) : (
        <ScrollView style={styles.dappsList}>
          {Object.values(connections).map(({ connector: c }) => (
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
              ? ` ${pendingConnector.peerMeta.name}`
              : ''
          }?`}
          okText={t('dapps_confirmation_button_connect')}
          cancelText={t('dapps_confirmation_button_cancel')}
          onOk={async () => {
            console.log('HANDLE APPROVE', pendingConnector)
            await handleApprove(pendingConnector, wallet)
          }}
          onCancel={async () => {
            console.log('HANDLE REJECT', pendingConnector)
            handleReject(pendingConnector)
          }}
        />
      ) : null}

      {disconnectingWC && (
        <ConfirmationModal
          isVisible={!!disconnectingWC}
          title={t('dapps_confirm_disconnection_title')}
          description={`${t('dapps_confirm_disconnection_description')}${
            disconnectingWC.peerMeta?.name
              ? ` ${disconnectingWC.peerMeta?.name}`
              : ''
          }?`}
          okText={t('dapps_confirm_disconnection_confirm')}
          cancelText={t('dapps_confirm_disconnection_cancel')}
          onOk={async () => {
            try {
              console.log(
                'DISCONNECTING WC PEER ID',
                disconnectingWC.peerId,
                disconnectingWC.peerMeta,
              )
              await disconnectingWC.killSession()
              setDisconnectingWC(null)
            } catch (err) {
              console.log('FAILED TO DISCONNECT', err)
            }
          }}
          onCancel={() => setDisconnectingWC(null)}
        />
      )}
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
