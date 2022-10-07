import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { TouchableOpacity, View } from 'react-native'
import { Arrow, RefreshIcon } from '../../components/icons'
import { SemiBoldText } from '../../components'
import { spacing } from '../../styles'
import ActivityField from '../../components/activity/ActivityField'
import { TokenImage } from '../home/TokenImage'
import CopyField from '../../components/activity/CopyField'
import StatusIcon from '../../components/statusIcons'
import { formatTimestamp } from '../../lib/utils'
import ButtonCustom from '../../components/activity/ButtonCustom'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { activityDetailsStyles as styles } from './styles'
import { BitcoinTransactionType } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { IBitcoinTransaction } from './types'

export default function ActivityDetailsBitcoinScreen({
  valueBtc,
  symbol,
  to,
  status,
  id,
  fees,
  blockTime,
  onBackPress,
  ...rest
}: BitcoinTransactionType & IBitcoinTransaction & { onBackPress: () => void }) {
  console.log(rest)
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
        <ButtonCustom
          secondText="view in explorer"
          icon={<SearchIcon width={30} height={30} color="white" />}
          onPress={onViewTransactionClick}
        />
      </View>
      <View style={styles.mb200} />
    </ScrollView>
  )
}
