import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { Avatar, Typography } from 'components/index'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

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

interface StatusTextProps {
  status: StatusEnum | undefined
}

export interface BasicRowProps {
  index?: number
  label: string
  secondaryLabel: string
  avatar: {
    name?: string
    imageSource?: ImageSourcePropType
    icon?: ReactElement
  }
  amount?: string
  status?: StatusTextProps['status']
  error?: string
  usdAmount?: string
  style?: StyleProp<ViewStyle>
  symbol?: string
}
export const BasicRow = ({
  index,
  label,
  secondaryLabel,
  status,
  error,
  amount,
  usdAmount,
  style,
  avatar,
  symbol,
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
        type="body2"
        style={styles.bold}
        accessibilityLabel={`label-${index}`}
        numberOfLines={1}
        ellipsizeMode="tail"
        adjustsFontSizeToFit>
        {label}
      </Typography>
      <Typography
        type="labelLight"
        accessibilityLabel={`secondaryLabel-${index}`}>
        {secondaryLabel} <StatusText status={status} />
      </Typography>
      {error && (
        <Typography
          type="h4"
          style={[styles.errorTextStyle, { color: COLORS_FOR_STATUS.FAILED }]}>
          {error}
        </Typography>
      )}
    </View>
    <View style={styles.thirdView}>
      <View style={styles.amountView}>
        {amount && (
          <Typography
            accessibilityLabel={`amount-${index}`}
            type="body2"
            style={[
              styles.flexShrinkOne,
              status === StatusEnum.FAILED ? styles.failedTransaction : {},
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit>
            {amount} {symbol}
          </Typography>
        )}
      </View>
      <View style={styles.usdAmountView}>
        {usdAmount && (
          <Typography
            accessibilityLabel={`usdAmount-${index}`}
            type="labelLight"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.usdText}>
            {usdAmount}
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
    backgroundColor: sharedColors.black,
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
    paddingRight: 5,
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
  bold: {
    fontWeight: 'bold',
  },
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
