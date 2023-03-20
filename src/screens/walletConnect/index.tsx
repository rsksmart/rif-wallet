import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'

import { RegularText, SemiBoldText, Typography } from 'components/index'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { sharedColors } from 'shared/constants'
import { colors } from 'src/styles'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { SlidePopupConfirmationInfo } from 'src/components/slidePopup/SlidePopupConfirmationInfo'

import { WalletConnectContext } from './WalletConnectContext'
import { DappItem } from './DappItem'

type Props = RootTabsScreenProps<rootTabsRouteNames.WalletConnect>

export const WalletConnectScreen = ({ navigation, route }: Props) => {
  const wcKey = route.params?.wcKey
  const { t } = useTranslation()
  const { wallet } = useAppSelector(selectActiveWallet)
  const { connections, handleApprove, handleReject } =
    useContext(WalletConnectContext)

  const openedConnections = Object.values(connections).filter(
    ({ connector: c }) => c.connected,
  )

  const pendingConnector = wcKey ? connections[wcKey]?.connector : null
  const dappName = pendingConnector?.peerMeta?.name || ''

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

      {pendingConnector && !pendingConnector.connected && (
        <SlidePopupConfirmationInfo
          title={t('dapps_confirmation_title')}
          description={`${t('dapps_confirmation_description')}${
            dappName ? ` ${dappName}` : ''
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
            <DappItem key={c.key} connector={c} />
          ))}
        </ScrollView>
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
