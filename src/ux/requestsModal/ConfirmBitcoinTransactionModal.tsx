import React from 'react'
import { StyleSheet, View } from 'react-native'
import { sharedStyles } from './sharedStyles'
import ReadOnlyField from './ReadOnlyField'
import {
  DarkBlueButton,
  OutlineBorderedButton,
} from '../../components/button/ButtonVariations'
import { colors } from '../../styles'
import { ScrollView } from 'react-native-gesture-handler'
import { SendBitcoinRequestType } from '../../lib/bitcoin/types'

type ConfirmBitcoinTransactionModal = {
  request: SendBitcoinRequestType
  closeModal: () => void
}

const ConfirmBitcoinTransactionModal: React.FC<
  ConfirmBitcoinTransactionModal
> = ({ request, closeModal }) => {
  const { payload, confirm, reject } = request

  const onReject = () => {
    reject('Closed')
    closeModal()
  }

  const onConfirm = () => {
    confirm()
    closeModal()
  }
  return (
    <ScrollView>
      <View>
        <View testID="TX_VIEW" style={[sharedStyles.rowInColumn]}>
          <ReadOnlyField
            label={'Sending'}
            value={payload.amountToPay.toString()}
            testID="Text.Message"
          />
        </View>
      </View>
      <View>
        <View testID="TX_TO_VIEW" style={[sharedStyles.rowInColumn]}>
          <ReadOnlyField
            label="To"
            value={payload.addressToPay}
            testID="Text.Message"
          />
        </View>
      </View>
      <View>
        <View testID="TX_MINING_FEE_VIEW" style={[sharedStyles.rowInColumn]}>
          <ReadOnlyField
            label="Mining Fee"
            value={payload.miningFee.toString()}
            testID="Text.Message"
          />
        </View>
      </View>
      <View style={{ ...sharedStyles.row, ...styles.spacing }}>
        <View style={sharedStyles.column}>
          <OutlineBorderedButton
            style={{ button: { borderColor: colors.black } }}
            onPress={onReject}
            title="reject"
            testID="Button.Reject"
          />
        </View>
        <View style={sharedStyles.column}>
          <DarkBlueButton
            onPress={onConfirm}
            title="confirm"
            testID="Button.Confirm"
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  spacing: { padding: 20 },
})
export default ConfirmBitcoinTransactionModal
