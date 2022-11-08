import React from 'react'
import { Text, TextInput } from 'react-native'
import { colors } from '../../styles'
import { sharedStyles as styles } from './sharedStyles'

interface IBitcoinSetAmountPresentation {
  handleAmountChange: any
  amountToPay: string
  error?: string
  available?: string
}
export const BitcoinSetAmountPresentation: React.FC<
  IBitcoinSetAmountPresentation
> = ({ handleAmountChange, amountToPay, error = '', available }) => (
  <>
    <Text style={styles.label}>
      amount {available && `(Available: ${available})`}
    </Text>
    <TextInput
      style={styles.textInputStyle}
      onChangeText={handleAmountChange}
      value={amountToPay}
      placeholder="0.00"
      keyboardType="phone-pad"
      testID={'Amount.Input'}
      placeholderTextColor={colors.gray}
    />
    {error !== '' && <Text style={styles.error}>{error}</Text>}
  </>
)
