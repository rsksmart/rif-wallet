import { Linking, TouchableOpacity, View } from 'react-native'
import { formatTimestamp, shortAddress } from '../../lib/utils'
import { ScrollView } from 'react-native-gesture-handler'
import { activityDetailsStyles as styles } from './styles'
import { Arrow, RefreshIcon } from '../../components/icons'
import { SemiBoldText } from '../../components'
import { spacing } from '../../styles'
import ActivityField from '../../components/activity/ActivityField'
import { TokenImage } from '../home/TokenImage'
import CopyField from '../../components/activity/CopyField'
import { utils } from 'ethers'
import StatusIcon from '../../components/statusIcons'
import ButtonCustom from '../../components/activity/ButtonCustom'
import { SearchIcon } from '../../components/icons/SearchIcon'
import React from 'react'
import { IActivityTransaction } from './types'

type ActivityDetailsContainer = {
  transaction: IActivityTransaction
  onBackPress: () => void
}
export default function ActivityDetailsContainer({
  transaction,
  onBackPress,
}: ActivityDetailsContainer) {
  const onViewExplorerClick = (): null => {
    Linking.openURL(
      `https://explorer.testnet.rsk.co/tx/${transaction.originTransaction.hash}`,
    )
    return null
  }

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
        <ButtonCustom
          secondText="view in explorer"
          icon={<SearchIcon width={30} height={30} color="white" />}
          onPress={onViewExplorerClick}
        />
      </View>
      <View style={styles.mb200} />
    </ScrollView>
  )
}
