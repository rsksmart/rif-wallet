import WalletConnect from '@walletconnect/client'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

import { Typography } from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { DappConnectConfirmation } from './DappConnectConfirmation'
import { DappDisconnectConfirmation } from './DappDisconnectConfirmation'
import { DappItem } from './DappItem'
import { WalletConnectContext } from './WalletConnectContext'

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>

export const WalletConnectScreen = ({ navigation, route }: Props) => {
  const wcKey = route.params?.wcKey

  const { t } = useTranslation()
  const { connections } = useContext(WalletConnectContext)
  const [disconnectingWC, setDisconnectingWC] = useState<WalletConnect | null>(
    null,
  )

  const openedConnections = Object.values(connections).filter(
    ({ connector: c }) => c.connected,
  )

  const pendingConnector = wcKey ? connections[wcKey]?.connector : null

  if (pendingConnector?.connected) {
    // clear pendingConnector
    navigation.navigate(rootTabsRouteNames.WalletConnect)
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

      {pendingConnector && !pendingConnector.connected && (
        <DappConnectConfirmation connector={pendingConnector} />
      )}

      {disconnectingWC && (
        <DappDisconnectConfirmation
          dappName={disconnectingWC.peerMeta?.name}
          onConfirm={() => disconnectingWC.killSession()}
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
