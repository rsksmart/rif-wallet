import { StyleSheet, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'

import { Typography } from 'components/index'
import { HideShowIcon } from 'components/icons'
import { noop, sharedColors } from 'shared/constants'
import { TokenImage } from 'screens/home/TokenImage'
import { Avatar } from 'components/avatar'
import { AppTouchable } from 'components/appTouchable'

interface Address {
  address: string
  name: string
  contactName: string
}

export interface CurrencyValue {
  symbol: string
  symbolType: string
  balance: string
}

interface Props {
  firstValue: CurrencyValue
  secondValue: CurrencyValue
  color: string
  hide?: boolean
  onSwap?: () => void
  onHide?: () => void
  editable?: boolean
  hideable?: boolean
  change?: number
  handleAmountChange?: (text: string) => void
  to?: Address
}

export const TokenBalance = ({
  firstValue,
  secondValue,
  change,
  color,
  hide = false,
  editable = false,
  onSwap = noop,
  hideable = false,
  onHide = noop,
  handleAmountChange = noop,
  to,
}: Props) => {
  const badgeColor = change && change >= 0 ? styles.greenBadge : styles.redBadge
  const { t } = useTranslation()

  return (
    <View style={[styles.balanceCard, { backgroundColor: color }]}>
      <View style={styles.container}>
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
                  {firstValue.symbol}{' '}
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
          <View
            style={
              editable ? [styles.container] : [styles.ident, styles.container]
            }>
            {secondValue.symbolType === 'icon' && (
              <View style={styles.tokenSubIcon}>
                <TokenImage
                  symbol={secondValue.symbol}
                  height={16}
                  width={16}
                />
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
          <View>
            {to && (
              <View style={styles.container}>
                <Typography type={'h3'}>{t('To')} </Typography>
                <Typography type={'h3'} style={{ color: sharedColors.primary }}>
                  {to.name ? to.name : to.address}
                </Typography>
              </View>
            )}
          </View>
        </View>
        <View>
          {to ? (
            <View style={styles.contactCard}>
              <View style={styles.center}>
                <Avatar size={30} name={to.name ? to.name : to.contactName} />
              </View>
              <Typography type={'h5'}>{to.contactName}</Typography>
            </View>
          ) : null}
          {hideable && (
            <View style={styles.center}>
              <AppTouchable
                width={46}
                onPress={onHide}
                accessibilityLabel="hide">
                <View style={styles.badge}>
                  <HideShowIcon
                    color={sharedColors.white}
                    height={20}
                    width={30}
                    isHidden={hide}
                  />
                </View>
              </AppTouchable>
            </View>
          )}
          {editable && (
            <View style={styles.center}>
              <AppTouchable
                width={41}
                onPress={onSwap}
                accessibilityLabel="swap">
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
      {!!change && (
        <View style={styles.changeRow}>
          <View style={{ ...styles.badge, ...badgeColor }}>
            <Typography type={'h5'} style={styles.badgeText}>
              {`${change > 0 ? '+' : ''}${change}%`}
            </Typography>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  center: {
    alignSelf: 'center',
  },
  grow: {
    flexDirection: 'column',
    flexGrow: 1,
  },
  balanceCard: {
    paddingHorizontal: 25,
    paddingVertical: 25,
    borderRadius: 0,
  },
  tokenIcon: {
    marginRight: 10,
    backgroundColor: sharedColors.white,
    borderRadius: 15,
    width: 30,
    height: 30,
  },
  tokenSubIcon: {
    marginRight: 5,
    backgroundColor: sharedColors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
  },
  ident: {
    paddingLeft: 42,
  },
  subTitle: {
    color: sharedColors.subAmount,
  },
  contactCard: {
    backgroundColor: sharedColors.inputInactive,
    padding: 20,
    borderRadius: 10,
  },
  badge: {
    padding: 8,
    borderRadius: 25,
    flexDirection: 'row',
  },
  greenBadge: {
    backgroundColor: sharedColors.success,
  },
  redBadge: {
    backgroundColor: sharedColors.danger,
  },
  badgeText: {
    fontSize: 10,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    color: sharedColors.white,
    fontWeight: '500',
    fontSize: 36,
  },
})