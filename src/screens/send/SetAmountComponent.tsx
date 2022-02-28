import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, TextInput, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { convertTokenToUSD, convertUSDtoToken } from '../../lib/utils'
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
  const [showUSD, setShowUSD] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const convertedAmount = showUSD
    ? convertTokenToUSD(Number(input) || 0, usdAmount || 0, true)
    : convertUSDtoToken(Number(input) || 0, usdAmount || 0, true)

  const handleTextChange = (text: string) => {
    // locally set the amount set and clear error
    setInput(text)
    setError(null)

    const amountToTransfer = showUSD
      ? convertUSDtoToken(Number(text), usdAmount || 0, false)
      : Number(text)

    const availableBalance = Number(
      balanceToString(token.balance, token.decimals || 0),
    )

    // call the parent with the converted value and isValid
    setAmount(
      amountToTransfer.toString(),
      amountToTransfer > availableBalance || amountToTransfer !== 0,
    )

    if (amountToTransfer > availableBalance) {
      setError('Insuficient funds')
    }
  }

  // clear the input if the token changes
  useEffect(() => {
    setError(null)
    setInput('')
    setShowUSD(false)
    setAmount('0', false)
  }, [token])

  return (
    <View>
      <View style={{ ...grid.row, ...styles.inputContainer }}>
        <View style={grid.column8}>
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
        {usdAmount && (
          <View style={grid.column4}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowUSD(!showUSD)}>
              <Text style={styles.toggleText}>
                {showUSD ? 'USD' : token.symbol}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={grid.row}>
        <View style={grid.column6}>
          <Text style={styles.text}>
            Max: {balanceToString(token.balance, token.decimals || 0)}
          </Text>
        </View>
        <View style={grid.column6}>
          {usdAmount && (
            <Text style={{ ...styles.text, ...styles.usdAmount }}>
              {`${convertedAmount} ${showUSD ? token.symbol : 'USD'}`}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colors.darkPurple2,
    height: 50,
    borderRadius: 10,
  },
  input: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    height: 50,
    paddingLeft: 10,
  },
  toggleButton: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  toggleText: {
    borderColor: colors.white,
    color: colors.white,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
    marginRight: 10,
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
