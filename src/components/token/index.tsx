import { useTranslation } from 'react-i18next'
import {
  Alert,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useCallback, useMemo } from 'react'
import Clipboard from '@react-native-community/clipboard'

import { shortAddress } from 'lib/utils'

import { AppTouchable } from 'components/appTouchable'
import { Avatar } from 'components/avatar'
import { Typography } from 'components/index'
import { TokenImage, TokenSymbol } from 'screens/home/TokenImage'
import { noop, sharedColors, sharedStyles, testIDs } from 'shared/constants'
import { ContactWithAddressRequired } from 'shared/types'
import { castStyle } from 'shared/utils'

import { EyeIcon } from '../icons/EyeIcon'
import { DollarIcon } from '../icons/DollarIcon'

export interface CurrencyValue {
  symbol: TokenSymbol | string
  symbolType: 'usd' | 'icon'
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
  contact?: ContactWithAddressRequired
  style?: StyleProp<ViewStyle>
  amIReceiver?: boolean
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
  contact,
  style,
  amIReceiver,
}: Props) => {
  const { t } = useTranslation()
  const isRifToken =
    firstValue.symbol?.toUpperCase() === 'RIF' ||
    firstValue.symbol?.toUpperCase() === 'TRIF'

  const toNameOrAddress = useMemo(() => {
    if (!contact) {
      return null
    }
    if (contact.name) {
      return `${contact.name}.rsk`
    }
    if (contact.displayAddress && contact.displayAddress.length < 20) {
      return contact.displayAddress
    }
    return shortAddress(contact.address)
  }, [contact])

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
            value={hide ? '\u002A\u002A\u002A\u002A' : firstValue.balance}
            keyboardType="numeric"
            testID={'Amount.Input'}
            placeholder="0"
            placeholderTextColor={sharedColors.inputLabelColor}
            style={[styles.input, [sharedStyles.flex]]}
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
          {secondValue?.symbolType === 'usd' && (
            <>
              {secondValue.symbol === '<' && (
                <Typography type={'body1'} style={styles.subTitle}>
                  {'<'}
                </Typography>
              )}
              <DollarIcon size={16} color={sharedColors.subTitle} />
            </>
          )}
          {!isNaN(Number(secondValue?.balance)) && (
            <Typography type={'body1'} style={styles.subTitle}>
              {hide
                ? '\u002A\u002A\u002A\u002A\u002A\u002A'
                : secondValue?.balance}
            </Typography>
          )}
        </View>
        {contact && (
          <View style={styles.toAddressContainer}>
            <Typography type="body1">
              {amIReceiver ? t('From') : t('To')}
            </Typography>
            <AppTouchable
              width={'100%'}
              onPress={onCopyAddress}
              style={styles.addressCopier}>
              <Typography
                type="body1"
                style={{
                  color: sharedColors.primary,
                }}>
                {toNameOrAddress}
              </Typography>
            </AppTouchable>
          </View>
        )}
      </View>
      <View style={styles.rightColumn}>
        {contact && contact.name ? (
          <View style={styles.contactCard}>
            <Avatar size={46} name={contact.name} />
            <View style={styles.contactName}>
              <Typography
                type="h4"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}>
                {contact.name}
              </Typography>
            </View>
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
    backgroundColor: sharedColors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
  }),
  subTitle: castStyle.text({
    color: sharedColors.subTitle,
    opacity: 0.7,
  }),
  contactCard: castStyle.view({
    backgroundColor: sharedColors.inputInactive,
    paddingVertical: 13.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
    height: 100,
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
  toAddressContainer: castStyle.view({
    flexDirection: 'row',
    width: 150,
    marginTop: 12,
  }),
  contactName: castStyle.text({
    width: '90%',
    alignItems: 'center',
  }),
  textSymbol: castStyle.text({ color: sharedColors.white, paddingTop: 3 }),
  addressCopier: castStyle.view({
    alignItems: 'flex-start',
    marginLeft: 4,
  }),
})
