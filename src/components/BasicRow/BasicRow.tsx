import { View, StyleSheet, ImageSourcePropType } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { Typography } from 'components/index'
import { sharedColors } from 'shared/constants'
import { Avatar } from 'components/avatar'

export enum StatusEnum {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export enum TransactionTypeEnum {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
}

const COLORS_FOR_STATUS = {
  [StatusEnum.PENDING]: sharedColors.warning,
  [StatusEnum.FAILED]: sharedColors.danger,
}

const TX_TYPE_SIGNS = {
  [TransactionTypeEnum.SENT]: '-',
  [TransactionTypeEnum.RECEIVED]: '+',
}

interface StatusTextProps {
  status: StatusEnum | undefined
}

interface BasicRowProps {
  label: string
  secondaryLabel: string
  status?: StatusTextProps['status']
  error?: string
  imageSource: ImageSourcePropType
  amount: string
  txType?: TransactionTypeEnum
  usdAmount?: string
  avatarName: string
}
export const BasicRow = ({
  label,
  secondaryLabel,
  status,
  error,
  imageSource = require('@rsksmart/rsk-contract-metadata/images/rif.png'),
  amount,
  txType,
  usdAmount,
  avatarName,
}: BasicRowProps) => (
  <View style={styles.container}>
    <View style={styles.firstView}>
      <Avatar
        style={styles.imageStyle}
        imageSource={imageSource}
        size={32}
        name={avatarName}
      />
    </View>
    <View style={styles.secondView}>
      <Typography
        type="h3"
        style={styles.h3Bold}
        numberOfLines={1}
        ellipsizeMode="tail">
        {label}
      </Typography>
      <Typography type="labelLight">
        {secondaryLabel} <StatusText status={status} />
      </Typography>
      {error !== undefined && (
        <Typography
          type="h4"
          style={[styles.errorTextStyle, { color: COLORS_FOR_STATUS.FAILED }]}>
          {error}
        </Typography>
      )}
    </View>
    <View style={styles.thirdView}>
      <View style={styles.amountView}>
        <View style={styles.flexGrowZero}>
          {txType !== undefined && (
            <Typography type="h3" style={styles.horizontalPadding}>
              {TX_TYPE_SIGNS[txType]}
            </Typography>
          )}
        </View>
        <View style={styles.flexGrowZero}>
          <MaterialIcon
            name={'north-east'}
            size={17}
            style={styles.horizontalPadding}
          />
        </View>
        <Typography
          type="h3"
          style={{
            ...styles.flexShrinkOne,
            ...(status === 'FAILED' && {
              textDecorationLine: 'line-through',
            }),
          }}
          numberOfLines={1}
          ellipsizeMode="tail">
          {amount}
        </Typography>
      </View>
      <View style={styles.usdAmountView}>
        {usdAmount !== undefined && txType !== undefined && (
          <Typography
            type="labelLight"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.usdText}>
            {TX_TYPE_SIGNS[txType]} ${usdAmount}
          </Typography>
        )}
      </View>
    </View>
  </View>
)

const StatusText = ({ status }: StatusTextProps) => {
  switch (status) {
    case StatusEnum.PENDING:
      return (
        <Typography
          type="labelLight"
          style={{ color: COLORS_FOR_STATUS[status] }}>
          • Pending
        </Typography>
      )
    case StatusEnum.FAILED:
      return (
        <Typography
          type="labelLight"
          style={{ color: COLORS_FOR_STATUS[status] }}>
          • Failed
        </Typography>
      )
    default:
      return null
  }
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: sharedColors.secondary,
    height: 'auto',
    flexDirection: 'row',
  },
  firstView: {
    paddingRight: 10,
  },
  secondView: {
    flex: 3,
    flexDirection: 'column',
    flexGrow: 1,
  },
  thirdView: {
    flexBasis: '27%',
  },
  amountView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  usdAmountView: {
    flexDirection: 'row',
    flex: 1,
  },
  usdText: {
    textAlign: 'right',
    flex: 1,
    color: sharedColors.labelLight,
  },
  horizontalPadding: {
    paddingRight: 1,
  },
  errorTextStyle: {
    marginTop: 6,
  },
  imageStyle: {
    width: '100%',
    flex: 1,
    maxHeight: 40,
    aspectRatio: 1,
  },
  h3Bold: { fontWeight: 'bold' },
  flexGrowZero: {
    flexGrow: 0,
  },
  flexShrinkOne: {
    flexShrink: 1,
  },
})
