import { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import WalletConnect from '@walletconnect/client'

import { Typography } from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { sharedColors } from 'shared/constants'
import { SlidePopupConfirmationInfo } from 'src/components/slidePopup/SlidePopupConfirmationInfo'
import { colors } from 'src/styles'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'

import { DAppDisconnectConfirmation } from './DappDisconnectConfirmation'
import { DappItem } from './DappItem'
import { WalletConnectContext } from './WalletConnectContext'

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>

export const WalletConnectScreen = ({ navigation, route }: Props) => {
  const wcKey = route.params?.wcKey

  const { t } = useTranslation()
  const { wallet } = useAppSelector(selectActiveWallet)
  const { connections, handleApprove, handleReject } =
    useContext(WalletConnectContext)
  const [disconnectingWC, setDisconnectingWC] = useState<WalletConnect | null>(
    null,
  )

  const openedConnections = Object.values(connections).filter(
    ({ connector: c }) => c.connected,
  )

  // const openedConnections = [
  //   {
  //     connector: {
  //       key: '1',
  //       connected: true,
  //       peerMeta: {
  //         name: 'RNS Manager',
  //         url: 'www.rnsmanager.orf',
  //       },
  //       killSession: () => {
  //         console.log('killSession')
  //       },
  //     },
  //   },
  //   {
  //     connector: {
  //       key: '2',
  //       connected: true,
  //       peerMeta: {
  //         name: 'Very long name of the dapp',
  //         url: 'https://dapp2.com',
  //       },
  //       killSession: () => {
  //         console.log('killSession')
  //       },
  //     },
  //   },
  //   {
  //     connector: {
  //       key: '3',
  //       connected: true,
  //       peerMeta: {
  //         name: 'Dapp 3',
  //         url: 'https://dapp3.com',
  //       },
  //       killSession: () => {
  //         console.log('killSession')
  //       },
  //     },
  //   },
  //   {
  //     connector: {
  //       key: '4',
  //       connected: true,
  //       peerMeta: {
  //         name: 'Dapp 4',
  //         url: 'https://dapp4.com',
  //       },
  //       killSession: () => {
  //         console.log('killSession')
  //       },
  //     },
  //   },
  // ]

  const pendingConnector = wcKey ? connections[wcKey]?.connector : null
  const pendingDappName = pendingConnector?.peerMeta?.name || ''

  if (pendingConnector?.connected) {
    // clear pendingConnector
    navigation.navigate(rootTabsRouteNames.WalletConnect)
  }

  const disconnectingDapps = useMemo(
    () =>
      ({} as {
        [key: string]: WalletConnect | null
      }),
    [],
  )

  const handleDisconnect = useCallback(
    (c: WalletConnect) => {
      disconnectingDapps[c.key] = c
      setDisconnectingWC(disconnectingDapps[c.key])
    },
    [disconnectingDapps],
  )

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

      {pendingConnector && !pendingConnector.connected && (
        <SlidePopupConfirmationInfo
          title={t('dapps_confirmation_title')}
          description={`${t('dapps_confirmation_description')}${
            pendingDappName ? ` ${pendingDappName}` : ''
          }?`}
          confirmText={t('dapps_confirmation_button_connect')}
          cancelText={t('dapps_confirmation_button_cancel')}
          onConfirm={() => handleApprove(pendingConnector, wallet)}
          onCancel={() => handleReject(pendingConnector)}
          height={300}
        />
      )}

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
              isDisconnecting={!!disconnectingDapps[c.key]}
              onDisconnect={() => handleDisconnect(c)}
            />
          ))}
        </ScrollView>
      )}

      {disconnectingWC && (
        <DAppDisconnectConfirmation
          dappName={disconnectingWC.peerMeta?.name}
          onConfirm={() => disconnectingWC.killSession()}
          onCancel={() => {
            disconnectingDapps[disconnectingWC.key] = null
            setDisconnectingWC(null)
          }}
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
