import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { shortAddress } from 'lib/utils'

import { AppTouchable } from 'components/appTouchable'
import { Avatar } from 'components/avatar'
import { Typography } from 'components/index'
import { TokenImage, TokenSymbol } from 'screens/home/TokenImage'
import { noop, sharedColors, sharedStyles, testIDs } from 'shared/constants'
import { ContactWithAddressRequired } from 'shared/types'
import { castStyle } from 'shared/utils'

import { EyeIcon } from '../icons/EyeIcon'

export interface CurrencyValue {
  symbol: TokenSymbol | string
  symbolType: 'text' | 'icon'
  balance: string
}

interface Props {
  firstValue: CurrencyValue
  secondValue?: CurrencyValue
  color?: string
  hide?: boolean
  onSwap?: () => void
  onHide?: () => void
  editable?: boolean
  hideable?: boolean
  handleAmountChange?: (text: string) => void
  to?: ContactWithAddressRequired
  style?: StyleProp<ViewStyle>
}

export const TokenBalance = ({
  firstValue,
  secondValue,
  color = sharedColors.black,
  hide = false,
  editable = false,
  onSwap,
  hideable = false,
  onHide = noop,
  handleAmountChange = noop,
  to,
  style,
}: Props) => {
  const { t } = useTranslation()

  return (
    <View style={[{ backgroundColor: color }, style]}>
      <View style={[styles.row, styles.balance]}>
        {firstValue.symbolType === 'icon' && (
          <View
            style={[
              styles.tokenIcon,
              !firstValue.symbol ? styles.tokenBackground : null,
            ]}>
            <TokenImage
              symbol={firstValue.symbol}
              height={30}
              width={30}
              transparent={true}
              color={color}
            />
          </View>
        )}
        {firstValue.symbolType === 'text' && (
          <Typography type={'h1'} style={{ color: sharedColors.white }}>
            {firstValue.symbol}
          </Typography>
        )}
        <TextInput
          onChangeText={handleAmountChange}
          value={
            hide ? '\u002A\u002A\u002A\u002A' : firstValue.balance.toString()
          }
          keyboardType="numeric"
          testID={'Amount.Input'}
          placeholderTextColor={sharedColors.white}
          style={[styles.input, [sharedStyles.flex]]}
          editable={editable}
          multiline={false}
        />
      </View>
      <View style={styles.rightIconContainer}>
        {to && to.name ? (
          <View style={styles.contactCard}>
            <Avatar size={40} name={to.name} />
            <Typography type={'body1'} style={styles.toNameContactText}>
              {to.name}
            </Typography>
          </View>
        ) : null}
        {hideable && !editable && (
          <AppTouchable
            width={46}
            onPress={onHide}
            accessibilityLabel={testIDs.hide}>
            <View style={styles.badge}>
              <EyeIcon color={sharedColors.white} size={25} isHidden={hide} />
            </View>
          </AppTouchable>
        )}
        {onSwap && (
          <AppTouchable
            width={41}
            onPress={onSwap}
            accessibilityLabel={testIDs.swap}>
            <View style={styles.badge}>
              <Icon
                name="ios-swap-vertical"
                color={sharedColors.white}
                size={25}
              />
            </View>
          </AppTouchable>
        )}
      </View>
      <View style={[styles.row, styles.ident]}>
        {secondValue?.symbolType === 'icon' && (
          <View style={styles.tokenSubIcon}>
            <TokenImage symbol={secondValue.symbol} height={16} width={16} />
          </View>
        )}
        {secondValue?.symbolType === 'text' && (
          <Typography type={'h3'} style={styles.subTitle}>
            {hide ? '' : secondValue.symbol}
          </Typography>
        )}
        {!isNaN(Number(secondValue?.balance)) && (
          <Typography type={'h3'} style={styles.subTitle}>
            {hide
              ? '\u002A\u002A\u002A\u002A\u002A\u002A'
              : secondValue?.balance}
          </Typography>
        )}
      </View>
      {to ? (
        <View style={[styles.toAddressContainer]}>
          <Typography type="h4">
            {t('To')}
            <Typography type="h4" style={{ color: sharedColors.primary }}>
              {' '}
              {to.displayAddress || shortAddress(to.address)}
            </Typography>
          </Typography>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: castStyle.view({
    flexDirection: 'row',
  }),
  balance: castStyle.view({
    flex: 1,
    alignItems: 'center',
  }),
  rightIconContainer: castStyle.view({
    alignItems: 'flex-end',
    justifyContent: 'center',
  }),
  tokenIcon: castStyle.view({
    marginRight: 10,
    width: 30,
    height: 30,
  }),
  tokenBackground: castStyle.view({
    borderRadius: 15,
    backgroundColor: sharedColors.white,
  }),
  tokenSubIcon: castStyle.view({
    marginRight: 5,
    backgroundColor: sharedColors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
  }),
  ident: {
    paddingLeft: 42,
  },
  subTitle: castStyle.text({
    color: sharedColors.subTitle,
    opacity: 0.7,
  }),
  contactCard: castStyle.view({
    backgroundColor: sharedColors.inputInactive,
    paddingVertical: 13.5,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
    height: '100%',
  }),
  badge: castStyle.view({
    padding: 8,
    borderRadius: 25,
    flexDirection: 'row',
  }),
  input: castStyle.text({
    color: sharedColors.white,
    fontWeight: '500',
    fontSize: 36,
    padding: 0,
  }),
  toAddressContainer: castStyle.view({
    marginTop: 12,
  }),
  toNameContactText: castStyle.view({ marginTop: 10 }),
})
