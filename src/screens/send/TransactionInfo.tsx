import {
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { Network } from 'bitcoin-address-validation'

import Clipboard from '@react-native-community/clipboard'
import { colors, spacing } from '../../styles/'
import { TokenImage } from '../home/TokenImage'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { StatusIcon } from '../../components/statusIcons'
import { useSelectedWallet } from 'src/Context'
import { getWalletSetting, SETTINGS } from 'src/core/config'
import { isBitcoinAddressValid } from 'lib/bitcoin/utils'

export interface TransactionInformation {
  status: 'USER_CONFIRM' | 'PENDING' | 'SUCCESS' | 'FAILED'
  to?: string
  value?: string
  symbol?: string
  hash?: string
}

type Props = {
  transaction: TransactionInformation
}

const isBtcAddress = (address?: string) => {
  if (address) {
    return (
      isBitcoinAddressValid(address, Network.testnet) ||
      isBitcoinAddressValid(address, Network.mainnet)
    )
  }
  return false
}

export const TransactionInfo = ({ transaction }: Props) => {
  const { chainId, chainType } = useSelectedWallet()
  const explorerUrl = isBtcAddress(transaction.to)
    ? `${getWalletSetting(SETTINGS.EXPLORER_ADDRESS_URL_BTC, 0, chainType)}/${
        transaction.hash
      }`
    : `${getWalletSetting(SETTINGS.EXPLORER_ADDRESS_URL, chainId)}/tx/${
        transaction.hash
      }`

  if (transaction.status === 'USER_CONFIRM' || !transaction.hash) {
    return (
      <View style={styles.mainLoadingContainer}>
        <Image
          source={require('../../images/transferWait.png')}
          style={styles.loading}
        />
        <Text style={styles.loadingLabel}>transferring ...</Text>
      </View>
    )
  }

  const onViewExplorerTouch = () => Linking.openURL(explorerUrl)

  const onCopyHash = () => Clipboard.setString(transaction.hash || '')

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.label}>you have just sent</Text>
      <View style={styles.sentContainer}>
        {transaction.symbol && (
          <>
            <TokenImage symbol={transaction.symbol} height={17} width={17} />
            <Text style={[styles.font16Bold, spacing.ml7]}>
              {transaction.symbol}
            </Text>
          </>
        )}
        <Text style={[spacing.ml3, styles.font16Bold]}>
          {transaction.value}
        </Text>
      </View>
      <View style={[spacing.mb30, spacing.mt7]}>
        {/* @TODO get real amount */}
        {/*<Text style={styles.font16}>$ 7439.55</Text>*/}
      </View>
      <Text style={styles.label}>to a recipient</Text>
      <View style={spacing.mb30}>
        <Text style={styles.font16Bold}>{transaction.to}</Text>
        <Text style={spacing.mt7}>{transaction.to}</Text>
      </View>
      <View style={spacing.mb30}>
        <Text style={styles.label}>status</Text>
        <View style={styles.sentContainer}>
          <View>
            <StatusIcon status={transaction.status} />
          </View>
          <Text style={styles.font16Bold}>
            {transaction.status.toLowerCase()}
          </Text>
        </View>
      </View>
      <View style={spacing.mb30}>
        <TouchableOpacity onPress={onCopyHash} accessibilityLabel="copy">
          <Text style={styles.label}>tx hash</Text>
          <Text style={styles.font16Bold}>{transaction.hash}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={onViewExplorerTouch}
          testID="Hash.OpenURLButton"
          accessibilityLabel="explorer">
          <View style={styles.buttonContainer}>
            <SearchIcon color="white" height={25} width={25} />
            <Text style={styles.buttonText}>view in explorer</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
    backgroundColor: colors.background.light,
    padding: 50,
  },
  flexDirRow: { flexDirection: 'row' },
  mainLoadingContainer: {
    backgroundColor: colors.background.light,
    paddingBottom: 50,
  },
  label: {
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 17,
  },
  loadingLabel: {
    textAlign: 'center',
  },
  font16: { fontSize: 16 },
  font16Bold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sentContainer: { flexDirection: 'row', alignItems: 'center' },
  buttonRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    backgroundColor: colors.background.button,
    padding: 15,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  buttonText: { color: 'white', marginLeft: 5 },
  loading: {
    alignSelf: 'center',
    marginBottom: 20,
  },
})
