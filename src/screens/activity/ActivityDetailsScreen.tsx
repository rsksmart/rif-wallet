import React from 'react'
import { StyleSheet, View, Linking, TouchableOpacity } from 'react-native'
import { utils } from 'ethers'
import { formatTimestamp, shortAddress } from '../../lib/utils'
import { IActivityTransaction } from './ActivityScreen'
import { ScrollView } from 'react-native-gesture-handler'
import { Arrow, RefreshIcon } from '../../components/icons'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { TokenImage } from '../home/TokenImage'
import StatusIcon from '../../components/statusIcons'
import ButtonCustom from '../../components/activity/ButtonCustom'
import CopyField from '../../components/activity/CopyField'
import { NavigationProp } from '../../RootNavigation'
import { MediumText, RegularText, SemiBoldText } from '../../components'

export type ActivityDetailsScreenProps = {
  route: { params: IActivityTransaction }
  navigation: NavigationProp
}

type ActivityFieldType = {
  ContainerProps?: object
  title: string
  children: any
}

const ActivityField: React.FC<ActivityFieldType> = ({
  ContainerProps = {},
  title,
  children,
}) => {
  return (
    <View style={styles.fieldContainer} {...ContainerProps}>
      <RegularText>{title}</RegularText>
      <View style={styles.wrapper}>{children}</View>
    </View>
  )
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
      <View style={styles.ph35}>
        <SemiBoldText style={styles.transDetails}>
          transaction details
        </SemiBoldText>
        <ActivityField title="transfer">
          <View style={styles.flexDirRow}>
            <View style={styles.amountContainer}>
              {/*  @TODO get cash amount for this text */}
              {/*<Text style={{ fontWeight: 'bold' }}>Cash Amount</Text>*/}
              <MediumText>
                {transaction.enhancedTransaction?.value ||
                  transaction.originTransaction.value}
              </MediumText>
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
            TextComp={MediumText}
          />
        </ActivityField>
        <ActivityField title="gas price">
          <View style={styles.flexDirRow}>
            <TokenImage
              symbol={transaction.enhancedTransaction?.symbol || ''}
            />
            <MediumText style={styles.textMrMl}>
              {transaction.enhancedTransaction?.symbol}
            </MediumText>
            <MediumText>{transaction.originTransaction.gas}</MediumText>
          </View>
        </ActivityField>
        <ActivityField title="gas limit">
          <View style={styles.flexDirRow}>
            <TokenImage
              symbol={transaction.enhancedTransaction?.symbol || ''}
            />
            <MediumText style={styles.textMrMl}>
              {transaction.enhancedTransaction?.symbol}
            </MediumText>
            <MediumText>
              {utils.formatUnits(transaction.originTransaction.gasPrice)}
            </MediumText>
          </View>
        </ActivityField>
        {/*  @TODO get tx type */}
        <ActivityField title="tx type">
          <MediumText>{transaction.originTransaction.txType}</MediumText>
        </ActivityField>
        <View style={styles.statusRow}>
          <ActivityField
            title="status"
            ContainerProps={{
              style: [styles.flexHalfSize, styles.statusField],
            }}>
            {/*  @TODO map status to the correct icon */}
            <View style={[styles.flexDirRow, styles.alignItemsCenter]}>
              <StatusIcon status={status} />
              <MediumText>{status}</MediumText>
            </View>
          </ActivityField>
          <ActivityField
            title="timestamp"
            ContainerProps={{
              style: [styles.flexHalfSize, styles.timestampField],
            }}>
            <MediumText>
              {formatTimestamp(transaction.originTransaction.timestamp)}
            </MediumText>
          </ActivityField>
        </View>
        <ActivityField
          title="tx hash"
          ContainerProps={{ style: { marginBottom: 40 } }}>
          <CopyField
            text={shortedTxHash}
            textToCopy={transaction.originTransaction.hash}
            TextComp={MediumText}
          />
        </ActivityField>
        <ButtonCustom
          firstText="1"
          firstTextColor="black"
          secondText="view in explorer"
          icon={<SearchIcon width={30} height={30} />}
          containerBackground="#C5CDEB"
          firstTextBackgroundColor="#A3A7C9"
          secondTextColor="#979ABE"
          onPress={onViewExplorerClick}
        />
        <View style={styles.mb200} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dbe3ff',
    paddingTop: 21,
  },
  ph35: { paddingHorizontal: 35 },
  backButtonContainer: {
    backgroundColor: '#c6ccea',
    alignSelf: 'flex-start',
    borderRadius: 40,
    marginBottom: 19,
    marginLeft: 15,
  },
  transDetails: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  wrapper: {
    backgroundColor: '#c6ccea',
    height: 70,
    borderRadius: 17,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 10,
    marginTop: 7,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  flexHalfSize: {
    flexGrow: 50,
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
  mr10: { marginRight: 10 },
  flexDirRow: {
    flexDirection: 'row',
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
})
