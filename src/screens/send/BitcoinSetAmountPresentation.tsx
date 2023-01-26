import { TextInput } from 'react-native'
import { RegularText } from 'src/components'
import { colors } from '../../styles'
import { sharedStyles as styles } from './sharedStyles'

interface IBitcoinSetAmountPresentation {
  handleAmountChange: () => void
  amountToPay: string
  error?: string
  available?: string
}
export const BitcoinSetAmountPresentation = ({
  handleAmountChange,
  amountToPay,
  error = '',
  available,
}: IBitcoinSetAmountPresentation) => (
  <>
    <RegularText style={styles.label}>
      amount {available && `(Available: ${available})`}
    </RegularText>
    <TextInput
      style={styles.textInputStyle}
      onChangeText={handleAmountChange}
      value={amountToPay}
      placeholder="0.00"
      keyboardType="phone-pad"
      testID={'Amount.Input'}
      placeholderTextColor={colors.gray}
    />
    {error !== '' && <RegularText style={styles.error}>{error}</RegularText>}
  </>
)
