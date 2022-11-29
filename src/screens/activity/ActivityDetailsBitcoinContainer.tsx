import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SecondaryButton } from 'src/components/button/SecondaryButton'
import { SemiBoldText } from 'src/components'
import ActivityField from 'src/components/activity/ActivityField'
import CopyField from 'src/components/activity/CopyField'
import { Arrow, RefreshIcon } from 'src/components/icons'
import { SearchIcon } from 'src/components/icons/SearchIcon'
import { StatusIcon } from 'src/components/statusIcons'
import { BitcoinTransactionType } from 'src/lib/rifWalletServices/RIFWalletServicesTypes'
import { formatTimestamp } from 'src/lib/utils'
import { spacing } from 'src/styles'
import { TokenImage } from '../home/TokenImage'
import { activityDetailsStyles as styles } from './styles'
import { IBitcoinTransaction } from './types'

type ActivityDetailsBitcoinContainerType = BitcoinTransactionType &
  IBitcoinTransaction & { onBackPress: () => void }

export default function ActivityDetailsBitcoinContainer({
  valueBtc,
  symbol,
  to,
  status,
  id,
  fees,
  blockTime,
  onBackPress,
}: ActivityDetailsBitcoinContainerType) {
  const onViewTransactionClick = (): null => {
    // @TODO: should open browser to block explorer for btc
    return null
  }
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
            {symbol && (
              <View style={styles.assetIcon}>
                <TokenImage symbol={symbol} height={30} width={30} />
              </View>
            )}
            <View style={styles.amountContainer}>
              {/*  @TODO get cash amount for this text */}
              {/*<Text style={{ fontWeight: 'bold' }}>Cash Amount</Text>*/}
              <SemiBoldText>
                {valueBtc} {symbol}
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
          <CopyField text={to} textToCopy={to} TextComp={SemiBoldText} />
        </ActivityField>
        <ActivityField title="mining fee">
          <View style={styles.flexDirRow}>
            <SemiBoldText>{fees} satoshi</SemiBoldText>
          </View>
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
                <SemiBoldText>{formatTimestamp(blockTime)}</SemiBoldText>
              </ActivityField>
            </View>
          </View>
        </View>
        <ActivityField title="tx hash">
          <CopyField text={id} textToCopy={id} TextComp={SemiBoldText} />
        </ActivityField>
      </View>
      <View style={styles.alignSelfCenter}>
        <SecondaryButton
          title="view in explorer"
          icon={<SearchIcon width={30} height={30} color="white" />}
          onPress={onViewTransactionClick}
          style={styles.viewExplorerButton}
        />
      </View>
      <View style={styles.mb50} />
    </ScrollView>
  )
}
