import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'

import { shortAddress } from 'lib/utils'

import { TokenImage, TokenSymbol } from 'screens/home/TokenImage'
import { Typography } from 'components/index'
import { AppTouchable } from 'components/appTouchable'
import { Avatar } from 'components/avatar'
import { ContactWithAddressRequired } from 'shared/types'
import { noop, sharedColors, testIDs } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { EyeIcon } from '../icons/EyeIcon'

export interface CurrencyValue {
  symbol: TokenSymbol | string
  symbolType: 'text' | 'icon'
  balance: string
}

interface Props {
  firstValue: CurrencyValue
  secondValue: CurrencyValue
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
    <View style={[styles.balanceCard, { backgroundColor: color }, style]}>
      <View style={styles.grow}>
        <View style={styles.container}>
          {firstValue.symbolType === 'icon' && (
            <View style={[styles.tokenIcon, styles.center]}>
              <TokenImage symbol={firstValue.symbol} height={24} width={24} />
            </View>
          )}
          {firstValue.symbolType === 'text' && (
            <View style={styles.center}>
              <Typography type={'h1'} style={{ color: sharedColors.white }}>
                {firstValue.symbol}
              </Typography>
            </View>
          )}

          <TextInput
            onChangeText={handleAmountChange}
            value={hide ? '\u002A\u002A\u002A\u002A' : firstValue.balance}
            placeholder="0.00"
            keyboardType="numeric"
            testID={'Amount.Input'}
            placeholderTextColor={sharedColors.white}
            style={styles.input}
            editable={editable}
          />
        </View>
        <View style={[styles.container, styles.ident]}>
          {secondValue.symbolType === 'icon' && (
            <View style={styles.tokenSubIcon}>
              <TokenImage symbol={secondValue.symbol} height={16} width={16} />
            </View>
          )}
          {secondValue.symbolType === 'text' && (
            <Typography type={'h3'} style={styles.subTitle}>
              {hide ? '' : secondValue.symbol}
            </Typography>
          )}
          <Typography type={'h3'} style={styles.subTitle}>
            {hide
              ? '\u002A\u002A\u002A\u002A\u002A\u002A'
              : secondValue.balance}
          </Typography>
        </View>
        {to ? (
          <View style={[styles.container, styles.toAddressContainer]}>
            <Typography type={'h3'}>{t('To')} </Typography>
            <Typography type={'h3'} style={{ color: sharedColors.primary }}>
              {to.displayAddress ? to.displayAddress : shortAddress(to.address)}
            </Typography>
          </View>
        ) : null}
      </View>
      <View>
        {to && to.name ? (
          <View style={styles.contactCard}>
            <Avatar size={40} name={to.name} />
            <Typography type={'body1'} style={styles.toNameContactText}>
              {to.name}
            </Typography>
          </View>
        ) : null}
        {hideable && !editable && (
          <View style={styles.center}>
            <AppTouchable
              width={46}
              onPress={onHide}
              accessibilityLabel={testIDs.hide}>
              <View style={styles.badge}>
                <EyeIcon color={sharedColors.white} size={20} isHidden={hide} />
              </View>
            </AppTouchable>
          </View>
        )}
        {onSwap && (
          <View style={styles.center}>
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
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flexDirection: 'row',
  }),
  center: castStyle.view({
    alignSelf: 'center',
  }),
  grow: castStyle.view({
    flexDirection: 'column',
    flexGrow: 1,
  }),
  balanceCard: castStyle.view({
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 18,
  }),
  tokenIcon: castStyle.view({
    marginRight: 10,
    backgroundColor: sharedColors.white,
    borderRadius: 15,
    width: 30,
    height: 30,
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
  }),
  toAddressContainer: castStyle.view({ marginTop: 12 }),
  toNameContactText: castStyle.view({ marginTop: 10 }),
})
