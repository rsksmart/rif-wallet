import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, TextInput, Text } from 'react-native'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { convertTokenToUSD } from '../../lib/utils'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { balanceToString } from '../balances/BalancesScreen'

interface Interface {
  setAmount: (amount: string, isValid: boolean) => void
  token: ITokenWithBalance
  usdAmount: number | undefined
}

const SetAmountComponent: React.FC<Interface> = ({
  setAmount,
  token,
  usdAmount,
}) => {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState<string>('')

  const usdConversion =
    usdAmount && convertTokenToUSD(Number(input) || 0, usdAmount || 0, true)

  const sanitizeDecimalText = (text: string) => {
    // convert commas to dots
    let newText = text.replace(/[^0-9,.]/g, '').replace(',', '.')
    const dotsCount = newText.split('.').length - 1
    if (dotsCount > 1 || (dotsCount === 1 && newText.length === 1)) {
      // remove the last character if it is a duplicated dot
      // or if the dot is the first character
      newText = newText.slice(0, -1)
    }
    return newText
  }

  const handleTextChange = (text: string) => {
    const amountText = sanitizeDecimalText(text)

    // locally set the amount set and clear error
    setInput(amountText)
    setError(null)

    const amountToTransfer = Number(amountText)

    const availableBalance = Number(
      balanceToString(token.balance, token.decimals || 0),
    )

    // call the parent with the converted value and isValid
    setAmount(
      amountToTransfer.toString(),
      amountToTransfer !== 0 && amountToTransfer <= availableBalance,
    )

    if (amountToTransfer > availableBalance) {
      setError('Insuficient funds')
    }
  }

  // clear the input if the token changes
  useEffect(() => {
    setError(null)
    setInput('')
    setAmount('0', false)
  }, [token])

  return (
    <View>
      <View style={{ ...grid.row, ...styles.inputContainer }}>
        <View style={grid.column12}>
          <TextInput
            style={styles.input}
            onChangeText={handleTextChange}
            value={input}
            placeholder={t('Amount')}
            keyboardType="numeric"
            testID={'Amount.Input'}
            placeholderTextColor={colors.gray}
          />
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={grid.row}>
        <View style={grid.column12}>
          {!!usdConversion && (
            <Text style={styles.text}>{`${usdConversion} USD`}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colors.darkPurple4,
    borderRadius: 15,
  },
  input: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    padding: 22,
  },
  text: {
    color: colors.white,
    fontWeight: '400',
    paddingVertical: 3,
    textAlign: 'left',
    marginRight: 5,
  },
  usdAmount: {
    textAlign: 'right',
  },
  error: {
    color: colors.orange,
  },
})

export default SetAmountComponent
