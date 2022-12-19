import { utils } from 'ethers'
import { Linking, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SemiBoldText } from 'src/components'
import ActivityField from 'src/components/activity/ActivityField'
import CopyField from 'src/components/activity/CopyField'
import { SecondaryButton } from 'src/components/button/SecondaryButton'
import { Arrow, RefreshIcon } from 'src/components/icons'
import { SearchIcon } from 'components/icons/SearchIcon'
import { StatusIcon } from 'components/statusIcons'
import { formatTimestamp, shortAddress } from 'src/lib/utils'
import { spacing } from 'src/styles'
import { TokenImage } from '../home/TokenImage'
import { activityDetailsStyles as styles } from './styles'
import { IActivityTransaction } from './types'
import { getWalletSetting, SETTINGS } from 'src/core/config'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'

type ActivityDetailsContainer = {
  transaction: IActivityTransaction
  onBackPress: () => void
}
export default function ActivityDetailsContainer({
  transaction,
  onBackPress,
}: ActivityDetailsContainer) {
  const { chainType } = useAppSelector(selectActiveWallet)
  const explorerUrl = getWalletSetting(SETTINGS.EXPLORER_ADDRESS_URL, chainType)
  const onViewExplorerClick = () =>
    Linking.openURL(`${explorerUrl}/tx/${transaction.originTransaction.hash}`)

  const status = transaction.originTransaction.receipt ? 'success' : 'pending'

  const currentAddress =
    transaction.enhancedTransaction?.to || transaction.originTransaction.to
  const shortedAddress = shortAddress(currentAddress, 10)
  const shortedTxHash = shortAddress(transaction.originTransaction.hash, 10)
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButtonContainer}
        onPress={onBackPress}>
        <Arrow color="#DBE3FF" height={25} width={25} rotate={270} />
      </TouchableOpacity>
      <SemiBoldText style={styles.transDetails}>
        transaction details
      </SemiBoldText>
      <View style={spacing.mh25}>
        <ActivityField title="value">
          <View style={styles.flexDirRow}>
            {transaction.enhancedTransaction?.symbol && (
              <View style={styles.assetIcon}>
                <TokenImage
                  symbol={transaction.enhancedTransaction?.symbol}
                  height={30}
                  width={30}
                />
              </View>
            )}
            <View style={styles.amountContainer}>
              {/*  @TODO get cash amount for this text */}
              {/*<Text style={{ fontWeight: 'bold' }}>Cash Amount</Text>*/}

              <SemiBoldText>
                {transaction.enhancedTransaction?.value ||
                  transaction.originTransaction.value}{' '}
                {transaction.enhancedTransaction?.symbol}
              </SemiBoldText>
            </View>
            <View>
              <RefreshIcon width={30} height={30} color="black" />
            </View>
          </View>
        </ActivityField>
        <ActivityField title="to">
          {/*  @TODO get name of the person who the user sent the coins to*/}
          {/*<Text>Name Here</Text>*/}
          <CopyField
            text={shortedAddress}
            textToCopy={currentAddress}
            TextComp={SemiBoldText}
          />
        </ActivityField>
        <ActivityField title="gas price">
          <View style={styles.flexDirRow}>
            <SemiBoldText>{transaction.originTransaction.gas}</SemiBoldText>
          </View>
        </ActivityField>
        <ActivityField title="gas limit">
          <View style={styles.flexDirRow}>
            <SemiBoldText>
              {utils.formatUnits(transaction.originTransaction.gasPrice)}
            </SemiBoldText>
          </View>
        </ActivityField>
        <ActivityField title="tx type">
          <SemiBoldText>{transaction.originTransaction.txType}</SemiBoldText>
        </ActivityField>
        <View>
          <View style={[styles.flexNoWrap, styles.flexDirRow]}>
            <View style={styles.statusRow}>
              <ActivityField title="status">
                <View style={[styles.flexDirRow, styles.alignItemsCenter]}>
                  <StatusIcon status={status} />
                  <SemiBoldText>{status}</SemiBoldText>
                </View>
              </ActivityField>
            </View>
            <View style={styles.timestampRow}>
              <ActivityField title="timestamp">
                <SemiBoldText>
                  {formatTimestamp(transaction.originTransaction.timestamp)}
                </SemiBoldText>
              </ActivityField>
            </View>
          </View>
        </View>
        <ActivityField title="tx hash">
          <CopyField
            text={shortedTxHash}
            textToCopy={transaction.originTransaction.hash}
            TextComp={SemiBoldText}
          />
        </ActivityField>
      </View>
      <View style={styles.alignSelfCenter}>
        <SecondaryButton
          title="view in explorer"
          accessibilityLabel="explorer"
          icon={<SearchIcon width={30} height={30} color="white" />}
          onPress={onViewExplorerClick}
          style={styles.viewExplorerButton}
        />
      </View>
      <View style={styles.mb50} />
    </ScrollView>
  )
}
