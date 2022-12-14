import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { PrimaryButton } from 'src/components/button/PrimaryButton'
import { SecondaryButton } from 'src/components/button/SecondaryButton'
import { MediumText } from 'src/components'
import { SendBitcoinRequestType } from 'src/lib/bitcoin/types'
import { convertSatoshiToBtcHuman } from 'src/lib/bitcoin/utils'
import { sharedStyles } from 'src/shared/styles'
import InputField from './InpuField'
import ReadOnlyField from './ReadOnlyField'

interface ConfirmBitcoinTransactionModalType {
  request: SendBitcoinRequestType
  closeModal: () => void
}

const TEST_IDS = {
  MODAL_SCROLLVIEW: 'MODAL_SCROLLVIEW',
  SENDING_VIEW: 'SENDING_VIEW',
  SENDING_VIEW_MESSAGE: 'SENDING_VIEW_MESSAGE',
  TO_VIEW: 'TO_VIEW',
  TO_VIEW_MESSAGE: 'TO_VIEW_MESSAGE',
  MINING_FEE_VIEW: 'MINING_FEE_VIEW',
  MINING_FEE_TEXT_INPUT: 'MINING_FEE_TEXT_INPUT',
  BUTTON_CONFIRM: 'BUTTON_CONFIRM',
  BUTTON_REJECT: 'BUTTON_REJECT',
}

const ConfirmBitcoinTransactionModal = ({
  request,
  closeModal,
}: ConfirmBitcoinTransactionModalType) => {
  const [status, setStatus] = useState<string>('')
  const { payload, confirm, reject } = request
  const { balance, amountToPay } = payload
  const [miningFee, setMiningFee] = useState<string>(
    payload.miningFee.toString(),
  )
  const minimumFee = React.useRef(141)
  const maximumMiningFee = React.useMemo(
    () => payload.balance - payload.amountToPay,
    [payload],
  )
  const isPaymentValid = () => {
    if (Number(miningFee) && Number(miningFee) < minimumFee.current) {
      setStatus(`Minimum mining fee is ${minimumFee.current}`)
      return false
    }
    if (Number(miningFee) && Number(miningFee) > maximumMiningFee) {
      setStatus(`Maximum mining fee is ${maximumMiningFee}`)
      return false
    }
    const totalPayment = Number(miningFee) + Number(amountToPay)
    return totalPayment <= Number(balance)
  }
  const onReject = () => {
    reject('Closed')
    closeModal()
  }

  const handleMiningFeeChange = (miningFeeValue: string) => {
    payload.payment.setMiningFee(Number(miningFeeValue))
    setMiningFee(miningFeeValue)
  }

  const amountToPayHuman = React.useMemo(
    () => convertSatoshiToBtcHuman(amountToPay),
    [amountToPay],
  )

  const onConfirm = () => {
    if (!isPaymentValid()) {
      return
    }
    setStatus('Sending transaction...')
    confirm()
      .then(() => {
        closeModal()
      })
      .catch(error => {
        switch (true) {
          case error.toString().includes('min relay fee not met'):
            const minimumFeeResponse = error.toString().split('<')[1].trim()
            minimumFee.current = Number(minimumFeeResponse)
            const newFee =
              minimumFeeResponse > maximumMiningFee
                ? maximumMiningFee
                : minimumFeeResponse
            if (minimumFeeResponse > maximumMiningFee) {
              setStatus(
                'Transaction failure due to insufficient funds dedicated to the mining fee. ' +
                  'Try to decrease the value sent. ' +
                  `The suggested minimum fee for this transaction is ${minimumFeeResponse}`,
              )
            } else {
              setStatus(
                `Transaction failure due to low mining fee. Mining fee increased to ${newFee}`,
              )
            }

            handleMiningFeeChange(newFee.toString())
            break
          default:
            setStatus(`Error: ${error.toString()}`)
        }
      })
  }
  return (
    <ScrollView testID={TEST_IDS.MODAL_SCROLLVIEW}>
      <View>
        <View testID={TEST_IDS.SENDING_VIEW} style={[sharedStyles.rowInColumn]}>
          <ReadOnlyField
            label={'Sending'}
            value={amountToPayHuman}
            testID={TEST_IDS.SENDING_VIEW_MESSAGE}
          />
        </View>
      </View>
      <View>
        <View testID={TEST_IDS.TO_VIEW} style={[sharedStyles.rowInColumn]}>
          <ReadOnlyField
            label="To"
            value={payload.addressToPay}
            testID={TEST_IDS.TO_VIEW_MESSAGE}
          />
        </View>
      </View>
      <View>
        <View
          testID={TEST_IDS.MINING_FEE_VIEW}
          style={[sharedStyles.rowInColumn]}>
          <InputField
            label={`Mining fee (MAX: ${maximumMiningFee})`}
            value={miningFee}
            keyboardType="number-pad"
            placeholder="mining fee"
            testID={TEST_IDS.MINING_FEE_TEXT_INPUT}
            handleValueOnChange={handleMiningFeeChange}
          />
        </View>
      </View>
      <View style={{ ...sharedStyles.row, ...styles.spacing }}>
        <View style={sharedStyles.column}>
          <SecondaryButton
            onPress={onReject}
            title="reject"
            testID={TEST_IDS.BUTTON_REJECT}
            accessibilityLabel="reject"
          />
        </View>
        <View style={sharedStyles.column}>
          <PrimaryButton
            onPress={onConfirm}
            title="confirm"
            testID={TEST_IDS.BUTTON_CONFIRM}
            accessibilityLabel="confirm"
          />
        </View>
      </View>
      {status !== '' && <MediumText>{status}</MediumText>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  spacing: { padding: 20 },
})
export default ConfirmBitcoinTransactionModal
