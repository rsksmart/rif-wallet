import React, { useState } from 'react'
import { TextInput, View } from 'react-native'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Request } from '../lib/core/RIFWallet'

import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'
import { BigNumber } from '@ethersproject/bignumber'
import { styles as sharedStyles } from './ModalComponent'

/**
 * Used for UI only to make editing transactions easier. Allows for
 * gasPrice to be '0.', '0.0', or blank, as the user types it in.
 */
interface StringTransaction {
  to: string
  from: string
  value: string
  data: string
  gasLimit: string
  gasPrice: string
}

interface Interface {
  request: Request
  closeModal: () => void
}

// string object helpers
const convertValueToString = (value?: any) => (value ? value.toString() : '')
const convertNumberToString = (value?: any) => (value ? value.toString() : '0')

const convertTransactionToStrings = (tx: TransactionRequest) => ({
  to: convertValueToString(tx.to),
  from: convertValueToString(tx.from),
  value: convertNumberToString(tx.value),
  // nonce: convertNumberToString(tx.nonce),
  data: convertValueToString(tx.data),
  gasLimit: convertNumberToString(tx.gasLimit),
  gasPrice: convertNumberToString(tx.gasPrice),
})

/*
  removed validations for now. we can use BigNumber.from to validate
  confirmTransaction will enforce that now

  if (gasPrice.match(/^(\d*)([,.]\d{0,})?$/)) {
    setUpdateTransaction({
      ...updateTransaction,
      gasPrice: gasPrice,
    })
  }
  if (parseInt(gasLimit, 10).toString() === gasLimit || gasLimit === '') {
    setUpdateTransaction({
      ...updateTransaction,
      gasLimit: gasLimit,
    })
  }

*/

const ReviewTransactionModal: React.FC<Interface> = ({
  request,
  closeModal,
}) => {
  const transactionRequest = convertTransactionToStrings(
    request.payload.transactionRequest,
  )

  const [gasPrice, setGasPrice] = useState(transactionRequest.gasPrice)
  const [gasLimit, setGasLimit] = useState(transactionRequest.gasLimit)

  // convert from string to Transaction and pass out of component
  const confirmTransaction = () => {
    request.confirm({
      gasPrice: BigNumber.from(gasPrice),
      gasLimit: BigNumber.from(gasLimit),
    })
    closeModal()
  }

  const cancelTransaction = () => {
    request.reject('User rejects the transaction')
    closeModal()
  }

  return (
    <View >
      <Header2>Review Transaction</Header2>
      <Paragraph>to: {transactionRequest.to}</Paragraph>
      <Paragraph>from: {transactionRequest.from}</Paragraph>
      <Paragraph>value: {transactionRequest.value}</Paragraph>
      <Paragraph>data: {transactionRequest.data}</Paragraph>

      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Paragraph>gas limit:</Paragraph>
        </View>
        <View style={sharedStyles.column}>
          <TextInput
            value={gasLimit}
            style={sharedStyles.textInput}
            onChangeText={setGasLimit}
            keyboardType="number-pad"
            placeholder="gas limit"
            testID="gasLimit.TextInput"
          />
        </View>
      </View>
      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Paragraph>gas price:</Paragraph>
        </View>
        <View style={sharedStyles.column}>
          <TextInput
            value={gasPrice}
            style={sharedStyles.textInput || ''}
            onChangeText={setGasPrice}
            keyboardType="number-pad"
            placeholder="gas price"
            testID="gasPrice.TextInput"
          />
        </View>
      </View>

      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Button
            title="Confirm"
            onPress={confirmTransaction}
            testID="Confirm.Button"
          />
        </View>
        <View style={sharedStyles.column}>
          <Button
            title="Cancel"
            onPress={cancelTransaction}
            testID="Cancel.Button"
          />
        </View>
      </View>
    </View>
  )
}

export default ReviewTransactionModal
