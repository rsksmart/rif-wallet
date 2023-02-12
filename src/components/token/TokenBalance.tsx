import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'

import {
  balanceToDisplay,
  balanceToUSD,
  convertTokenToUSD,
  convertUSDtoToken,
  sanitizeDecimalText,
} from 'lib/utils'

import { RegularText, Typography } from 'components/index'
import { HideShowIcon } from 'components/icons'
import { sharedColors } from 'shared/constants'
import { TokenImage } from '../../screens/home/TokenImage'
import { Avatar } from 'components/avatar'
import { ITokenWithoutLogo } from 'src/redux/slices/balancesSlice/types'

interface Address {
  address: string
  name: string
  contactName: string
}

interface ITokenWithPrice extends ITokenWithoutLogo {
  price: number
}

interface Props {
  token: ITokenWithPrice
  change?: number
  color: string
  editable?: boolean
  setAmount?: (amount: string, isValid: boolean) => void
  hideable?: boolean
  to?: Address
}

export const TokenBalance = ({
  token: { decimals, price, symbol, balance },
  change,
  color,
  editable = false,
  hideable = false,
  to,
  setAmount,
}: Props) => {
  const [showBalances, setShowBalances] = useState<boolean>(true)
  const [swap, setSwap] = useState<boolean>(false)
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const [usdAmount, setUsdAmount] = useState<string>('')
  const badgeColor = change && change >= 0 ? styles.greenBadge : styles.redBadge
  const onSetBalances = () => setShowBalances(!showBalances)
  const onSwap = () => setSwap(!swap)
  const { t } = useTranslation()

  const handleAmountChange = (text: string) => {
    const amountText = sanitizeDecimalText(text)
    let amountToTransfer = 0
    if (swap) {
      setUsdAmount(amountText)
      const tokenConversion =
        '' + convertUSDtoToken(Number(amountText), price, true)
      setTokenAmount(tokenConversion)
      amountToTransfer = Number(tokenConversion)
    } else {
      setTokenAmount(amountText)
      setUsdAmount('' + convertTokenToUSD(Number(amountText) || 0, price, true))
      amountToTransfer = Number(amountText)
    }

    const availableBalance = Number(balanceToDisplay(balance, decimals || 0))
    if (setAmount) {
      setAmount(
        amountToTransfer.toString(),
        amountToTransfer !== 0 && amountToTransfer <= availableBalance,
      )

      if (amountToTransfer > availableBalance) {
        // setError('Insuficient funds')
      }
    }
  }

  return (
    <View style={[styles.balanceCard, { backgroundColor: color }]}>
      <View style={styles.container}>
        <View style={styles.grow}>
          <View style={styles.container}>
            {editable &&
              (!swap ? (
                <>
                  <View style={[styles.tokenIcon, styles.center]}>
                    <TokenImage symbol={symbol} height={24} width={24} />
                  </View>
                  <TextInput
                    onChangeText={handleAmountChange}
                    value={tokenAmount}
                    placeholder="0.00"
                    keyboardType="numeric"
                    testID={'Amount.Input'}
                    placeholderTextColor={sharedColors.white}
                    style={styles.input}
                  />
                </>
              ) : (
                <>
                  <View style={styles.center}>
                    <Typography type="h1" style={{ color: sharedColors.white }}>
                      ${' '}
                    </Typography>
                  </View>
                  <TextInput
                    onChangeText={handleAmountChange}
                    value={usdAmount}
                    placeholder="0.00"
                    keyboardType="numeric"
                    testID={'Amount.Input'}
                    placeholderTextColor={sharedColors.white}
                    style={styles.input}
                  />
                </>
              ))}
            {!editable && (
              <>
                <View style={styles.tokenIcon}>
                  <TokenImage symbol={symbol} height={24} width={24} />
                </View>
                <Typography type="h1">
                  {showBalances
                    ? balanceToDisplay(balance || 0, decimals, 5)
                    : '\u002A\u002A\u002A\u002A'}
                </Typography>
              </>
            )}
          </View>
          <View style={styles.container}>
            {editable &&
              (!swap ? (
                <>
                  <Typography type="h3" style={styles.subTitle}>
                    ${' '}
                  </Typography>
                  <Typography type="h3" style={styles.subTitle}>
                    {tokenAmount === ''
                      ? '0.00'
                      : '' +
                        convertTokenToUSD(
                          Number(tokenAmount) || 0,
                          price,
                          true,
                        )}
                  </Typography>
                </>
              ) : (
                <>
                  <View style={styles.tokenSubIcon}>
                    <TokenImage symbol={symbol} height={16} width={16} />
                  </View>
                  <Typography type="h3" style={styles.subTitle}>
                    {tokenAmount === '' ? '0.00' : tokenAmount}
                  </Typography>
                </>
              ))}
            {!editable && (
              <Typography style={[styles.ident, styles.subTitle]} type="h3">
                {showBalances
                  ? balanceToUSD(balance || 0, decimals, price)
                  : '\u002A\u002A\u002A\u002A\u002A\u002A'}
              </Typography>
            )}
          </View>
          <View>
            {to && (
              <View style={styles.container}>
                <Typography type="h3">{t('To')} </Typography>
                <Typography type="h3" style={{ color: sharedColors.primary }}>
                  {to.name ? to.name : to.address}
                </Typography>
              </View>
            )}
          </View>
        </View>
        <View>
          {to && (
            <View style={styles.contactCard}>
              <View style={styles.center}>
                <Avatar size={30} name={to.name ? to.name : to.contactName} />
              </View>
              <Typography type="h5">{to.contactName}</Typography>
            </View>
          )}
          {hideable && (
            <View style={styles.center}>
              <TouchableOpacity
                onPress={onSetBalances}
                accessibilityLabel="hide">
                <View style={styles.badge}>
                  <HideShowIcon
                    color={sharedColors.white}
                    height={20}
                    width={30}
                    isHidden={showBalances}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
          {editable && (
            <View style={styles.center}>
              <TouchableOpacity onPress={onSwap} accessibilityLabel="swap">
                <View style={styles.badge}>
                  <Icon
                    name="ios-swap-vertical"
                    color={sharedColors.white}
                    size={25}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {!!change && (
        <View style={styles.changeRow}>
          <View style={{ ...styles.badge, ...badgeColor }}>
            <RegularText style={styles.badgeText}>
              {`${change > 0 ? '+' : ''}${change}%`}
            </RegularText>
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

export default TokenBalance
