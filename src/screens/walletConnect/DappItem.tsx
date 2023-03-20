import WalletConnect from '@walletconnect/client'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import { truncate } from 'lib/utils'

import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { Typography } from 'src/components'

export const DappItem = ({ connector: c }: { connector: WalletConnect }) => {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <View style={styles.dappIcon} />
      <View style={styles.content}>
        <View style={styles.dappNameView}>
          <Typography type="body2">
            {truncate(c.peerMeta?.name || '', 20)}
          </Typography>
          <Typography type="body3" style={styles.dappConnected}>
            {t('dapps_connected')}
          </Typography>
        </View>
        <Typography type="body3" style={styles.dappUrl}>
          {c.peerMeta?.url}
        </Typography>
      </View>
      <TouchableOpacity
        accessibilityLabel="dapp"
        style={sharedStyles.flex}
        onPress={() => c.killSession()}>
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
  dappConnected: castStyle.text({
    backgroundColor: sharedColors.connected,
    color: sharedColors.black,
    fontSize: 10,
    paddingHorizontal: 5,
    paddingBottom: 1,
    borderRadius: 10,
    marginLeft: 10,
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
