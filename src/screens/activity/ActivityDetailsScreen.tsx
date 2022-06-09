import React from 'react'
import { StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native'
import { utils } from 'ethers'
import { formatTimestamp } from '../../lib/utils'
import { IActivityTransaction } from './ActivityScreen'
import { ScrollView } from 'react-native-gesture-handler'
import { CopyIcon, RefreshIcon } from '../../components/icons'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { TokenImage } from '../home/TokenImage'
import Clipboard from '@react-native-community/clipboard'

export type ActivityDetailsScreenProps = {
  route: { params: IActivityTransaction }
}

type ActivityFieldType = {
  ContainerProps?: object
  title: string
  children: any
}

type ButtonType = {
  firstText: string
  icon: React.FC | any
  secondText: string
  containerBackground?: string | null
  firstTextColor?: string | null
  firstTextBackgroundColor?: string | null
  secondTextColor?: string | null
  onPress: () => null
}

const ButtonCustom: React.FC<ButtonType> = ({
  firstText,
  icon = null,
  secondText,
  containerBackground = null,
  firstTextColor = null,
  firstTextBackgroundColor = null,
  secondTextColor = null,
  onPress,
}) => {
  const overrideContainerBackground = containerBackground
    ? { backgroundColor: containerBackground }
    : {}
  const firstTextStyle = { color: firstTextColor || 'white' }
  const firstTextBackgroundStyle = {
    backgroundColor:
      firstTextBackgroundColor || styles.buttonViewMain.backgroundColor,
  }
  const secondTextStyle = {
    color: secondTextColor || 'white',
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonTouchOpacity, overrideContainerBackground]}>
      <View style={firstTextBackgroundStyle}>
        <Text style={firstTextStyle}>{firstText}</Text>
      </View>
      <View style={styles.mr10}>{icon}</View>
      <Text style={[secondTextStyle, styles.fwb]}>{secondText}</Text>
    </TouchableOpacity>
  )
}

const ActivityField: React.FC<ActivityFieldType> = ({
  ContainerProps = {},
  title,
  children,
}) => {
  return (
    <View style={styles.fieldContainer} {...ContainerProps}>
      <Text>{title}</Text>
      <View style={styles.wrapper}>{children}</View>
    </View>
  )
}

export const ActivityDetailsScreen: React.FC<ActivityDetailsScreenProps> = ({
  route,
}) => {
  const transaction = route.params

  const onViewExplorerClick = (): null => {
    Linking.openURL(
      `https://explorer.testnet.rsk.co/tx/${transaction.originTransaction.hash}`,
    )
    return null
  }

  const onHashCopy = (): null => {
    Clipboard.setString(transaction.originTransaction.hash)
    return null
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.transDetails}>transaction details</Text>
      <ActivityField title="transfer">
        <View style={styles.flexDirRow}>
          <View style={styles.amountContainer}>
            {/*  @TODO get cash amount for this text */}
            {/*<Text style={{ fontWeight: 'bold' }}>Cash Amount</Text>*/}
            <Text>
              {transaction.enhancedTransaction?.value ||
                transaction.originTransaction.value}
            </Text>
          </View>
          <View>
            <RefreshIcon width={30} height={30} color="black" />
          </View>
        </View>
      </ActivityField>
      <ActivityField title="to">
        {/*  @TODO get name of the person who the user sent the coins to*/}
        {/*<Text>Name Here</Text>*/}
        <Text>
          {transaction.enhancedTransaction?.to ||
            transaction.originTransaction.to}
        </Text>
      </ActivityField>
      <ActivityField title="gas price">
        <View style={styles.flexDirRow}>
          <TokenImage symbol={transaction.enhancedTransaction?.symbol || ''} />
          <Text style={styles.textMrMl}>
            {transaction.enhancedTransaction?.symbol}
          </Text>
          <Text>{transaction.originTransaction.gas}</Text>
        </View>
      </ActivityField>
      <ActivityField title="gas limit">
        <View style={styles.flexDirRow}>
          <TokenImage symbol={transaction.enhancedTransaction?.symbol || ''} />
          <Text style={styles.textMrMl}>
            {transaction.enhancedTransaction?.symbol}
          </Text>
          <Text>
            {utils.formatUnits(transaction.originTransaction.gasPrice)}
          </Text>
        </View>
      </ActivityField>
      {/*  @TODO get tx type */}
      {/*<ActivityField title="tx type">*/}
      {/*  <Text>token transfer</Text>*/}
      {/*</ActivityField>*/}
      <View style={styles.statusRow}>
        <ActivityField
          title="status"
          ContainerProps={{ style: [styles.flexHalfSize, styles.statusField] }}>
          {/*  @TODO map status to the correct icon */}
          <Text>
            {transaction.originTransaction.receipt
              ? transaction.originTransaction.receipt.status
              : 'PENDING'}
          </Text>
        </ActivityField>
        <ActivityField
          title="timestamp"
          ContainerProps={{
            style: [styles.flexHalfSize, styles.timestampField],
          }}>
          <Text>
            {formatTimestamp(transaction.originTransaction.timestamp)}
          </Text>
        </ActivityField>
      </View>
      <ActivityField
        title="tx hash"
        ContainerProps={{ style: { marginBottom: 40 } }}>
        <Text>{transaction.originTransaction.hash}</Text>
      </ActivityField>
      <ButtonCustom
        firstText="1"
        secondText="copy hash"
        icon={<CopyIcon />}
        onPress={onHashCopy}
      />
      <ButtonCustom
        firstText="2"
        firstTextColor="black"
        secondText="view in explorer"
        icon={<SearchIcon width={30} height={30} />}
        containerBackground="#C5CDEB"
        firstTextBackgroundColor="#A3A7C9"
        secondTextColor="#979ABE"
        onPress={onViewExplorerClick}
      />
      <View style={styles.mb200} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttonTouchOpacity: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 40,
    backgroundColor: '#050134',
    alignSelf: 'flex-start',
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonViewMain: {
    marginRight: 10,
    backgroundColor: 'rgba(219, 227, 255, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  container: {
    backgroundColor: '#dbe3ff',
    paddingTop: 50,
    paddingHorizontal: 35,
  },
  transDetails: {
    marginBottom: 20,
    fontWeight: 'bold',
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
    marginTop: 10,
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
  amountContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
  fwb: { fontWeight: 'bold' },
})
