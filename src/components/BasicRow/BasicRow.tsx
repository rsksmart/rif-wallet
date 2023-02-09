import { useMemo } from 'react'
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { Typography } from 'src/components'
import { sharedColors } from 'shared/constants'

const COLORS_FOR_STATUS = {
  PENDING: sharedColors.warning,
  FAILED: sharedColors.danger,
}

const TX_TYPE_SIGNS = {
  SENT: '-',
  RECEIVED: '+',
}

interface StatusTextProps {
  status: 'PENDING' | 'FAILED' | undefined
}

interface BasicRowProps {
  label: string
  secondaryLabel: string
  status?: StatusTextProps['status']
  error?: string
  imageSource: ImageSourcePropType
  amount: string
  txType?: 'SENT' | 'RECEIVED'
  usdAmount?: string
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
}: BasicRowProps) => {
  const labelSliced = useMemo(() => {
    if (label.length >= 23) {
      return label.slice(0, 21) + '...'
    }
    return label
  }, [label])
  return (
    <View style={styles.container}>
      <View style={styles.firstView}>
        <Image
          style={styles.imageStyle}
          source={imageSource}
          resizeMode="contain"
        />
      </View>
      <View style={styles.secondView}>
        <Typography type={'h3'}>{labelSliced}</Typography>
        <Typography type={'labellight'}>
          {secondaryLabel} <StatusText status={status} />
        </Typography>
        {error !== undefined && (
          <Typography
            type={'h4'}
            style={[
              styles.errorTextStyle,
              { color: COLORS_FOR_STATUS.FAILED },
            ]}>
            {error}
          </Typography>
        )}
      </View>
      <View style={styles.thirdView}>
        <View style={styles.amountView}>
          {txType !== undefined && (
            <Typography type={'h3'} style={styles.horizontalPadding}>
              {TX_TYPE_SIGNS[txType]}
            </Typography>
          )}
          <MaterialIcon
            name={'north-east'}
            size={17}
            style={styles.horizontalPadding}
          />
          <Typography
            type={'h3'}
            style={{
              ...(status === 'FAILED' && {
                textDecorationLine: 'line-through',
              }),
            }}>
            {amount}
          </Typography>
        </View>
        {usdAmount !== undefined && txType !== undefined && (
          <Typography type={'labellight'}>
            {TX_TYPE_SIGNS[txType]} ${usdAmount}
          </Typography>
        )}
      </View>
    </View>
  )
}

const StatusText = ({ status }: StatusTextProps) => {
  switch (status) {
    case 'PENDING':
      return (
        <Typography
          type="labellight"
          style={{ color: COLORS_FOR_STATUS[status] }}>
          • Pending
        </Typography>
      )
    case 'FAILED':
      return (
        <Typography
          type="labellight"
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
  },
  thirdView: {
    flex: 1,
    alignItems: 'flex-end',
  },
  amountView: {
    flexDirection: 'row',
  },
  horizontalPadding: {
    paddingRight: 2,
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
})
