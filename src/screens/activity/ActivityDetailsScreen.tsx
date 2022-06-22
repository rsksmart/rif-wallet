import React from 'react'
import { StyleSheet, View, Linking, TouchableOpacity } from 'react-native'
import { utils } from 'ethers'
import { formatTimestamp, shortAddress } from '../../lib/utils'
import { IActivityTransaction } from './ActivityScreen'
import { ScrollView } from 'react-native-gesture-handler'
import { Arrow, RefreshIcon } from '../../components/icons'
import { SearchIcon } from '../../components/icons/SearchIcon'
import StatusIcon from '../../components/statusIcons'
import ButtonCustom from '../../components/activity/ButtonCustom'
import CopyField from '../../components/activity/CopyField'
import { NavigationProp } from '../../RootNavigation'
import { SemiBoldText } from '../../components'
import ActivityField from '../../components/activity/ActivityField'
import { spacing } from '../../styles'

export type ActivityDetailsScreenProps = {
  route: { params: IActivityTransaction }
  navigation: NavigationProp
}

export const ActivityDetailsScreen: React.FC<ActivityDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const transaction = route.params
  const onViewExplorerClick = (): null => {
    Linking.openURL(
      `https://explorer.testnet.rsk.co/tx/${transaction.originTransaction.hash}`,
    )
    return null
  }

  const onBackPress = (): null => {
    navigation.goBack()
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
            <View style={styles.amountContainer}>
              {/*  @TODO get cash amount for this text */}
              {/*<Text style={{ fontWeight: 'bold' }}>Cash Amount</Text>*/}
              <SemiBoldText>
                {transaction.enhancedTransaction?.value ||
                  transaction.originTransaction.value}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dbe3ff',
    paddingTop: 21,
  },
  backButtonContainer: {
    backgroundColor: '#c6ccea',
    alignSelf: 'flex-start',
    borderRadius: 40,
    marginBottom: 19,
    marginLeft: 15,
  },
  transDetails: {
    marginBottom: 20,
    paddingHorizontal: 35,
  },
  flexHalfSize: {
    flexGrow: 1,
  },
  statusField: {
    marginRight: 10,
  },
  timestampField: {
    marginLeft: 10,
  },
  mb200: {
    marginBottom: 200,
  },
  textMrMl: {
    marginRight: 4,
    marginLeft: 2,
  },
  flexDirRow: {
    flexDirection: 'row',
  },
  flexNoWrap: {
    flexWrap: 'nowrap',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
  fwb: { fontWeight: 'bold' },
  statusRow: {
    flex: 40,
    marginRight: 10,
  },
  timestampRow: {
    flex: 60,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
})
