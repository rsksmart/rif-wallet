import { ReactElement } from 'react'
import {
  View,
  StyleSheet,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useTranslation } from 'react-i18next'

import { Typography, Avatar } from 'components/index'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'src/shared/utils'

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

export interface BasicRowProps {
  label: string
  secondaryLabel: string
  avatar: {
    name: string
    imageSource?: ImageSourcePropType
    icon?: ReactElement
  }
  amount?: string
  status?: StatusTextProps['status']
  error?: string
  txType?: TransactionTypeEnum
  usdAmount?: string
  style?: StyleProp<ViewStyle>
}
export const BasicRow = ({
  label,
  secondaryLabel,
  status,
  error,
  amount,
  txType,
  usdAmount,
  style,
  avatar,
}: BasicRowProps) => (
  <View style={[styles.container, style]}>
    <View style={styles.firstView}>
      <Avatar
        style={styles.imageStyle}
        imageSource={avatar.imageSource}
        icon={avatar.icon}
        size={40}
        name={avatar.name}
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
            name="north-east"
            size={17}
            style={styles.horizontalPadding}
            color="white"
          />
        </View>
        {amount ? (
          <Typography
            type="h3"
            style={[
              styles.flexShrinkOne,
              status === StatusEnum.FAILED ? styles.failedTransaction : {},
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {amount}
          </Typography>
        ) : null}
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
  const { t } = useTranslation()

  switch (status) {
    case StatusEnum.PENDING:
      return (
        <Typography
          type="labelLight"
          style={{ color: COLORS_FOR_STATUS[status] }}>
          {t('basic_row_pending')}
        </Typography>
      )
    case StatusEnum.FAILED:
      return (
        <Typography
          type="labelLight"
          style={{ color: COLORS_FOR_STATUS[status] }}>
          {t('basic_row_failed')}
        </Typography>
      )
    default:
      return null
  }
}
const styles = StyleSheet.create({
  container: castStyle.view({
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: sharedColors.secondary,
    height: 'auto',
    flexDirection: 'row',
  }),
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
  failedTransaction: {
    textDecorationLine: 'line-through',
  },
})
