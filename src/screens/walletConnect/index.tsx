import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import { RegularText, SemiBoldText } from 'src/components'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { ConfirmationModal } from '../../components/modal/ConfirmationModal'
import { colors } from '../../styles'
import { WalletConnectContext } from './WalletConnectContext'

type WalletConnectScreenProps =
  RootStackScreenProps<rootStackRouteNames.WalletConnect>

export const WalletConnectScreen = ({
  navigation,
  route,
}: WalletConnectScreenProps) => {
  const wcKey = route.params?.wcKey
  const { t } = useTranslation()
  const { wallet } = useAppSelector(selectActiveWallet)
  const { connections, handleApprove, handleReject } =
    useContext(WalletConnectContext)

  const openedConnections = Object.values(connections).filter(
    ({ connector: c }) => c.connected,
  )

  const pendingConnector = wcKey ? connections[wcKey]?.connector : null

  if (pendingConnector?.connected) {
    // clear pendingConnector
    navigation.navigate(rootStackRouteNames.WalletConnect)
  }

  return (
    <View style={styles.parent}>
      <View style={styles.header}>
        <View style={styles.innerHeader1}>
          <RegularText style={styles.title}>{t('Connected Dapps')}</RegularText>
          <RegularText style={styles.subtitle}>
            {t('Connect new Dapp by scanning a QR code.')}
          </RegularText>
        </View>
        <View style={styles.innerHeader2} />
      </View>
      {pendingConnector && !pendingConnector.connected && (
        <ConfirmationModal
          title={`${t('Connect to')} ${
            pendingConnector?.peerMeta?.name || 'Dapp'
          }?`}
          okText={t('Connect')}
          cancelText={t('Reject')}
          onOk={() => handleApprove(pendingConnector, wallet)}
          onCancel={() => handleReject(pendingConnector)}
        />
      )}
      {openedConnections.length === 0 ? (
        <>
          <Image
            source={require('../../images/empty-dapps.png')}
            style={styles.noDappsImage}
          />
          <View style={styles.noDappsTextView} testID="emptyView">
            <RegularText style={styles.noDappsText}>
              {t('You are currently not')}
            </RegularText>
            <RegularText style={styles.noDappsText}>
              {t('connected to any Dapp.')}
            </RegularText>
          </View>
        </>
      ) : (
        <ScrollView style={styles.dappsList}>
          {openedConnections.map(({ connector: c }) => (
            <LinearGradient
              key={c.key}
              colors={[colors.background.secondary, colors.background.primary]}
              style={styles.dapp}>
              <View style={styles.dappInner}>
                <Image
                  source={require('../../images/dapp-icon.png')}
                  style={styles.dappIcon}
                />
                <View style={styles.dappNameView}>
                  <SemiBoldText style={styles.dappName}>
                    {c.peerMeta?.name}
                  </SemiBoldText>
                  <RegularText style={styles.dappUrl}>
                    {c.peerMeta?.url}
                  </RegularText>
                </View>
                <TouchableOpacity
                  accessibilityLabel="dapp"
                  style={styles.dappButtonView}
                  onPress={() => c.killSession()}>
                  <Image
                    source={require('../../images/disconnect-dapp.png')}
                    style={styles.dappButton}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.background.darkBlue,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
  },
  innerHeader1: {
    flex: 2,
  },
  innerHeader2: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.text.primary,
    marginTop: 10,
  },
  noDappsImage: {
    flex: 4,
    alignSelf: 'center',
    width: '90%',
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
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  dappUrl: {
    fontSize: 12,
    color: colors.text.secondary,
  },
})
