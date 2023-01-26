import Clipboard from '@react-native-community/clipboard'
import { Network } from 'bitcoin-address-validation'
import { isBitcoinAddressValid } from 'lib/bitcoin/utils'
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { RegularText, SemiBoldText } from 'src/components'
import { getWalletSetting, SETTINGS } from 'src/core/config'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { StatusIcon } from '../../components/statusIcons'
import { colors, spacing } from '../../styles/'
import { TokenImage } from '../home/TokenImage'
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
  const { chainType } = useAppSelector(selectActiveWallet)
  const explorerUrl = isBtcAddress(transaction.to)
    ? `${getWalletSetting(SETTINGS.EXPLORER_ADDRESS_URL_BTC, chainType)}/${
        transaction.hash
      }`
    : `${getWalletSetting(SETTINGS.EXPLORER_ADDRESS_URL, chainType)}/tx/${
        transaction.hash
      }`

  if (transaction.status === 'USER_CONFIRM' || !transaction.hash) {
    return (
      <View style={styles.mainLoadingContainer}>
        <Image
          source={require('../../images/transferWait.png')}
          style={styles.loading}
        />
        <RegularText style={styles.loadingLabel}>transferring...</RegularText>
      </View>
    )
  }

  const onViewExplorerTouch = () => Linking.openURL(explorerUrl)

  const onCopyHash = () => Clipboard.setString(transaction.hash || '')

  return (
    <View style={styles.mainContainer}>
      <SemiBoldText style={styles.label}>you have just sent</SemiBoldText>
      <View style={styles.sentContainer}>
        {transaction.symbol && (
          <>
            <TokenImage symbol={transaction.symbol} height={17} width={17} />
            <SemiBoldText style={spacing.ml7}>
              {transaction.symbol}
            </SemiBoldText>
          </>
        )}
        <SemiBoldText style={spacing.ml3}>{transaction.value}</SemiBoldText>
      </View>
      <View style={[spacing.mb20, spacing.mt7]}>
        {/* @TODO get real amount */}
        {/*<RegularText>$ 7439.55</RegularText>*/}
      </View>
      <RegularText style={styles.label}>to a recipient</RegularText>
      <View style={spacing.mb20}>
        <SemiBoldText>{transaction.to}</SemiBoldText>
      </View>
      <View style={spacing.mb20}>
        <RegularText style={styles.label}>status</RegularText>
        <View style={styles.sentContainer}>
          <StatusIcon status={transaction.status} />
          <SemiBoldText style={spacing.ml3}>
            {transaction.status.toLowerCase()}
          </SemiBoldText>
        </View>
      </View>
      <View style={spacing.mb20}>
        <TouchableOpacity onPress={onCopyHash} accessibilityLabel="copy">
          <RegularText style={styles.label}>tx hash</RegularText>
          <SemiBoldText>{transaction.hash}</SemiBoldText>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={onViewExplorerTouch}
          testID="Hash.OpenURLButton"
          accessibilityLabel="explorer">
          <View style={styles.buttonContainer}>
            <SearchIcon color="white" height={25} width={25} />
            <RegularText style={styles.buttonText}>
              view in explorer
            </RegularText>
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
  flexDirRow: {
    flexDirection: 'row',
  },
  mainLoadingContainer: {
    paddingBottom: 50,
  },
  label: {
    fontSize: 16,
  },
  loadingLabel: {
    textAlign: 'center',
  },
  sentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
  loading: {
    alignSelf: 'center',
    marginBottom: 20,
  },
})
