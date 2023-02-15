import { useEffect, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import { convertTokenToUSD, sanitizeDecimalText } from 'lib/utils'

import { RegularText } from 'src/components'
import { colors } from '../../styles/colors'
import { grid } from '../../styles/grid'
import { balanceToString } from '../balances/BalancesScreen'

export interface ISetAmountComponent {
  setAmount: (amount: string, isValid: boolean) => void
  token: ITokenWithBalance
  usdAmount: number | undefined
}

export const SetAmountComponent = ({
  setAmount,
  token,
  usdAmount,
}: ISetAmountComponent) => {
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState<string>('')

  const usdConversion =
    usdAmount && convertTokenToUSD(Number(input) || 0, usdAmount || 0, true)

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
  }, [setAmount])

  return (
    <View>
      <View style={{ ...grid.row, ...styles.inputContainer }}>
        <View style={grid.column12}>
          <TextInput
            style={styles.input}
            onChangeText={handleTextChange}
            value={input}
            placeholder="0.00"
            keyboardType="numeric"
            testID={'Amount.Input'}
            placeholderTextColor={colors.gray}
          />
        </View>
      </View>
      {error && <RegularText style={styles.error}>{error}error</RegularText>}
      <View style={grid.row}>
        <View style={grid.column12}>
          {!!usdConversion && (
            <RegularText
              style={styles.text}>{`${usdConversion} USD`}</RegularText>
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
    marginLeft: 5,
  },
  usdAmount: {
    textAlign: 'right',
  },
  error: {
    color: colors.orange,
    marginLeft: 5,
  },
})

export default SetAmountComponent
