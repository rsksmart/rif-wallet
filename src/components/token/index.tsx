import Clipboard from '@react-native-clipboard/clipboard'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  ColorValue,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { AppTouchable } from 'components/appTouchable'
import { Typography } from 'components/index'
import { ContactCard } from 'screens/contacts/components'
import { TokenImage, TokenSymbol } from 'screens/home/TokenImage'
import { noop, sharedColors, sharedStyles, testIDs } from 'shared/constants'
import { ContactWithAddressRequired } from 'shared/types'
import { castStyle, formatTokenValue, formatFiatValue } from 'shared/utils'

import { DollarIcon } from '../icons/DollarIcon'
import { EyeIcon } from '../icons/EyeIcon'

export interface CurrencyValue {
  symbol: TokenSymbol | string
  symbolType: 'usd' | 'icon'
  balance: number | string
}

interface Props {
  firstValue: CurrencyValue
  secondValue?: CurrencyValue
  color?: ColorValue | string
  hide?: boolean
  error?: string
  onSwap?: () => void
  onHide?: () => void
  editable?: boolean
  hideable?: boolean
  handleAmountChange?: (text: string) => void
  contact?: ContactWithAddressRequired
  style?: StyleProp<ViewStyle>
  amIReceiver?: boolean
}

enum TestID {
  ErrorTypography = 'ErrorTypography',
}

export const TokenBalance = ({
  firstValue,
  secondValue,
  color = sharedColors.black,
  hide = false,
  editable = false,
  error,
  onSwap,
  hideable = false,
  onHide = noop,
  handleAmountChange = noop,
  contact,
  style,
  amIReceiver,
}: Props) => {
  const { t } = useTranslation()
  const isRifToken =
    firstValue.symbol?.toUpperCase() === 'RIF' ||
    firstValue.symbol?.toUpperCase() === 'TRIF'

  const firstValueBalance = editable
    ? firstValue.balance.toString()
    : formatTokenValue(firstValue.balance)

  const onCopyAddress = useCallback(() => {
    if (contact) {
      Clipboard.setString(contact.address)
      Alert.alert(t('address_copied_to_keyboard'), undefined, [
        { text: t('ok'), onPress: noop },
      ])
    }
  }, [contact, t])

  return (
    <View style={[{ backgroundColor: color }, style, styles.container]}>
      <View style={styles.leftColumn}>
        <View style={[sharedStyles.row, styles.balance]}>
          {firstValue.symbolType === 'icon' && (
            <View
              style={[
                styles.tokenIcon,
                !firstValue.symbol ? styles.tokenBackground : null,
              ]}>
              <TokenImage
                symbol={firstValue.symbol}
                size={30}
                transparent
                white={isRifToken}
                color={color}
              />
            </View>
          )}
          {firstValue.symbolType === 'usd' && (
            <DollarIcon size={30} color={sharedColors.white} />
          )}
          <TextInput
            onChangeText={handleAmountChange}
            value={hide ? '\u002A\u002A\u002A\u002A\u002A' : firstValueBalance}
            keyboardType="numeric"
            accessibilityLabel={'Amount.Input'}
            placeholder="0"
            placeholderTextColor={sharedColors.inputLabelColor}
            style={[styles.input, sharedStyles.flex]}
            editable={editable}
            multiline={false}
            clearTextOnFocus
          />
        </View>
        <View style={[sharedStyles.row, sharedStyles.alignCenter]}>
          {secondValue?.symbolType === 'icon' && (
            <View style={styles.tokenSubIcon}>
              <TokenImage symbol={secondValue.symbol} />
            </View>
          )}
          {secondValue && (
            <Typography type="body1" style={styles.subTitle}>
              {hide
                ? '\u002A\u002A\u002A\u002A\u002A'
                : secondValue.symbolType === 'usd'
                ? formatFiatValue(secondValue.balance)
                : formatTokenValue(secondValue.balance)}
            </Typography>
          )}
          {error && (
            <Typography
              type="body2"
              style={styles.error}
              accessibilityLabel={TestID.ErrorTypography}>
              {error}
            </Typography>
          )}
        </View>
        {contact && (
          <View style={styles.addressRow}>
            <Typography type="body1" style={styles.addressLabel}>
              {amIReceiver ? t('From') : t('To')}
            </Typography>
            <AppTouchable
              width="100%"
              onPress={onCopyAddress}
              style={styles.addressCopier}>
              <Typography
                type={contact.name ? 'body1' : 'label'}
                numberOfLines={1}
                adjustsFontSizeToFit
                style={
                  contact.name ? styles.nameContent : styles.addressContent
                }>
                {contact.name || contact.address}
              </Typography>
            </AppTouchable>
          </View>
        )}
      </View>
      <View style={styles.rightColumn}>
        {contact?.name ? <ContactCard name={contact.name} /> : null}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    height: 90,
    justifyContent: 'space-between',
    flexDirection: 'row',
  }),
  leftColumn: castStyle.view({
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  }),
  rightColumn: castStyle.view({
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  }),
  balance: castStyle.view({
    alignItems: 'center',
  }),
  tokenIcon: castStyle.view({
    width: 30,
    height: 30,
  }),
  tokenBackground: castStyle.view({
    borderRadius: 15,
    backgroundColor: sharedColors.white,
  }),
  tokenSubIcon: castStyle.view({
    borderRadius: 10,
    width: 20,
    height: 20,
    marginRight: 4,
  }),
  subTitle: castStyle.text({
    color: sharedColors.subTitle,
    opacity: 0.7,
  }),
  error: castStyle.text({
    color: sharedColors.dangerLight,
    marginLeft: 4,
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
    paddingLeft: 6,
  }),
  addressRow: castStyle.view({
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  }),
  addressLabel: castStyle.text({
    paddingRight: 4,
  }),
  addressCopier: castStyle.view({
    flex: 1,
    alignItems: 'flex-start',
  }),
  nameContent: castStyle.text({
    color: sharedColors.primary,
  }),
  addressContent: castStyle.text({
    color: sharedColors.primary,
    paddingTop: 6,
  }),
})
