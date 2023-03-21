import WalletConnect from '@walletconnect/client'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

import { Typography } from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { sharedColors } from 'shared/constants'
import { colors } from 'src/styles'

import { DAppConnectConfirmation } from './DappConnectConfirmation'
import { DAppDisconnectConfirmation } from './DappDisconnectConfirmation'
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
        <DAppConnectConfirmation connector={pendingConnector} />
      )}

      {disconnectingWC && (
        <DAppDisconnectConfirmation
          dappName={disconnectingWC.peerMeta?.name}
          onConfirm={() => disconnectingWC.killSession()}
          onCancel={() => setDisconnectingWC(null)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: sharedColors.secondary,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
  },
  innerHeader1: {
    flex: 3,
  },
  innerHeader2: {
    flex: 1,
  },
  subtitle: {
    marginTop: 10,
  },
  noDappsImage: {
    flex: 4,
    alignSelf: 'center',
    width: '80%',
    resizeMode: 'contain',
  },
  noDappsTextView: {
    flex: 1,
    alignSelf: 'center',
  },
  noDappsText: {
    color: colors.text.primary,
    fontSize: 14,
    textAlign: 'center',
  },
  dappsList: {
    flex: 1,
    marginTop: 20,
  },
  dapp: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  dappInner: {
    flexDirection: 'row',
  },
  dappIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  dappNameView: {
    flex: 3,
    marginLeft: 20,
  },
  dappName: {
    fontSize: 16,
    color: colors.text.primary,
  },
  dappButtonView: {
    flex: 1,
  },
  dappButton: {
    flex: 1,
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  dappUrl: {
    fontSize: 12,
    color: colors.text.secondary,
  },
})
