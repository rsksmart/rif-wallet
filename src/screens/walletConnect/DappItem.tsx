import WalletConnect from '@walletconnect/client'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import { truncate } from 'lib/utils'

import { Typography } from 'components/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'

type Props = {
  connector: WalletConnect
  isDisconnecting: boolean
  onDisconnect: () => void
}

export const DappItem = ({
  connector: c,
  isDisconnecting,
  onDisconnect,
}: Props) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <View style={styles.dappIcon} />
      <View style={styles.content}>
        <View style={styles.dappNameView}>
          <Typography type="body2">
            {truncate(c.peerMeta?.name || '', isDisconnecting ? 18 : 20)}
          </Typography>
          <Typography
            type="body3"
            style={[
              styles.dappStatus,
              isDisconnecting ? styles.dappDisconnecting : styles.dappConnected,
            ]}>
            {isDisconnecting ? t('dapps_disconnecting') : t('dapps_connected')}
          </Typography>
        </View>
        <Typography type="body3" style={styles.dappUrl}>
          {c.peerMeta?.url}
        </Typography>
      </View>
      <TouchableOpacity
        accessibilityLabel="disconnectDapp"
        style={sharedStyles.flex}
        onPress={onDisconnect}>
        <Image
          source={require('src/images/disconnect-dapp.png')}
          style={styles.dappButton}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flexDirection: 'row',
    backgroundColor: sharedColors.inputInactive,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 16,
    paddingRight: 24,
  }),
  dappIcon: castStyle.view({
    width: 30,
    height: 30,
    backgroundColor: sharedColors.white,
    borderRadius: 15,
  }),
  content: castStyle.view({
    flex: 3,
    marginLeft: 20,
  }),
  dappNameView: castStyle.view({
    flexDirection: 'row',
    alignItems: 'flex-end',
  }),
  dappStatus: castStyle.text({
    color: sharedColors.black,
    fontSize: 10,
    paddingHorizontal: 5,
    paddingBottom: 1,
    borderRadius: 10,
    marginLeft: 10,
  }),
  dappConnected: castStyle.text({
    backgroundColor: sharedColors.connected,
  }),
  dappDisconnecting: castStyle.text({
    backgroundColor: sharedColors.warning,
  }),
  dappUrl: castStyle.text({
    color: sharedColors.qrColor,
    opacity: 0.6,
  }),
  dappButton: castStyle.image({
    flex: 1,
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  }),
})
