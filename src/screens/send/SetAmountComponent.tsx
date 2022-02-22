import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, TextInput, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { balanceToString } from '../balances/BalancesScreen'

interface Interface {
  setAmount: (amount: string) => void
  token: ITokenWithBalance
  usdAmount: number | undefined
  // maxBalance: number
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

  const convertedAmount = showUSD ? input : input

  const handleTextChange = (text: string) => {
    // locally set the amount set:
    setInput(text)

    // call the parent with the converted value
    setAmount(text)

    // clear errors before checking
    setError(null)

    const maxBalance = Number(
      balanceToString(token.balance, token.decimals || 0),
    )

    if (Number(text) > maxBalance) {
      setError('Insuficient funds')
    }
  }

  // clear the input if the token changes
  useEffect(() => {
    setError(null)
    setInput('0')
    setAmount('0')
  }, [token])

  return (
    <View style={styles.container}>
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
                {showUSD ? token.symbol : 'USD'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.maxBalance}>
        {`${convertedAmount} ${showUSD ? 'USD' : token.symbol}`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
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
  maxBalance: {
    color: colors.white,
    fontWeight: '400',
    paddingVertical: 3,
    textAlign: 'right',
    marginRight: 5,
  },
  error: {
    color: colors.orange,
  },
})

export default SetAmountComponent
