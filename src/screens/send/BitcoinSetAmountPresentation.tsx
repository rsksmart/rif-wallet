import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'

import { convertTokenToUSD } from 'lib/utils'

import { RegularText, Typography } from 'src/components'
import { sharedColors } from 'shared/constants'
import { TokenImage } from '../home/TokenImage'
import { sharedStyles } from './sharedStyles'

interface IBitcoinSetAmountPresentation {
  handleAmountChange: (text: string, swap: boolean) => void
  amountToPay: string
  symbol: string
  usdAmount: number | undefined
  usdToPay: string
  error?: string
  available?: string
}
export const BitcoinSetAmountPresentation = ({
  handleAmountChange,
  amountToPay,
  usdToPay,
  error = '',
  available,
  usdAmount,
  symbol,
}: IBitcoinSetAmountPresentation) => {
  const [swap, setSwap] = useState<boolean>(false)
  const onSwap = () => {
    setSwap(!swap)
  }

  return (
    <View
      style={[
        styles.column,
        { backgroundColor: sharedColors.tokenBackground },
      ]}>
      <RegularText style={sharedStyles.label}>
        amount {available && `(Available: ${available})`}
      </RegularText>
      <View style={styles.row}>
        {!swap && (
          <>
            <View style={[styles.tokenIcon, styles.center]}>
              <TokenImage symbol={symbol} height={24} width={24} />
            </View>
            <TextInput
              onChangeText={text => handleAmountChange(text, swap)}
              value={amountToPay}
              placeholder="0.00"
              keyboardType="phone-pad"
              testID={'Amount.Input'}
              placeholderTextColor={sharedColors.white}
              style={[styles.input, styles.fill]}
            />
          </>
        )}
        {swap && (
          <>
            <View style={styles.center}>
              <Typography type="h1" style={{ color: sharedColors.white }}>
                ${' '}
              </Typography>
            </View>
            <TextInput
              onChangeText={text => handleAmountChange(text, swap)}
              value={'' + usdToPay || ''}
              placeholder="0.00"
              keyboardType="phone-pad"
              testID={'Amount.Input'}
              placeholderTextColor={sharedColors.white}
              style={[styles.input, styles.fill]}
            />
          </>
        )}
        <View style={styles.center}>
          <TouchableOpacity onPress={onSwap} accessibilityLabel="swap">
            <View>
              <Icon
                name="ios-swap-vertical"
                color={sharedColors.white}
                size={25}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.row}>
        {!swap && (
          <>
            <Typography type="h3" style={styles.subTitle}>
              ${' '}
            </Typography>
            <Typography type="h3" style={styles.subTitle}>
              {amountToPay === ''
                ? '0.00'
                : '' +
                  convertTokenToUSD(
                    Number(amountToPay) || 0,
                    usdAmount || 0,
                    true,
                  )}
            </Typography>
          </>
        )}
        {swap && (
          <>
            <View style={[styles.tokenSubIcon, styles.center]}>
              <TokenImage symbol={symbol} height={16} width={16} />
            </View>
            <Typography type="h3" style={styles.subTitle}>
              {amountToPay === '' ? '0.00' : amountToPay}
            </Typography>
          </>
        )}
      </View>
      {error !== '' && (
        <RegularText style={sharedStyles.error}>{error}</RegularText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  tokenIcon: {
    marginRight: 10,
    backgroundColor: sharedColors.white,
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  fill: {
    flex: 1,
  },
  tokenSubIcon: {
    marginRight: 5,
    backgroundColor: sharedColors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
  },
  center: {
    alignSelf: 'center',
  },
  input: {
    color: sharedColors.white,
    fontWeight: '500',
    fontSize: 36,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
    paddingHorizontal: 25,
    paddingVertical: 25,
    borderRadius: 0,
  },
  subTitle: {
    color: sharedColors.subAmount,
  },
})
