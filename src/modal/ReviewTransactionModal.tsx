import React, { useState } from 'react'
import { Modal, StyleSheet, TextInput, View } from 'react-native'

import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Request } from '../lib/core/RIFWallet'

import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'
import { BigNumber } from '@ethersproject/bignumber'

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
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={true}
        onRequestClose={cancelTransaction}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Header2>Review Transaction</Header2>
            <Paragraph>to: {transactionRequest.to}</Paragraph>
            <Paragraph>from: {transactionRequest.from}</Paragraph>
            <Paragraph>value: {transactionRequest.value}</Paragraph>
            <Paragraph>data: {transactionRequest.data}</Paragraph>

            <View style={styles.row}>
              <View style={styles.column}>
                <Paragraph>gas limit:</Paragraph>
              </View>
              <View style={styles.column}>
                <TextInput
                  value={gasLimit}
                  style={styles.textInput}
                  onChangeText={setGasLimit}
                  keyboardType="number-pad"
                  placeholder="gas limit"
                  testID="gasLimit.TextInput"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Paragraph>gas price:</Paragraph>
              </View>
              <View style={styles.column}>
                <TextInput
                  value={gasPrice}
                  style={styles.textInput || ''}
                  onChangeText={setGasPrice}
                  keyboardType="number-pad"
                  placeholder="gas price"
                  testID="gasPrice.TextInput"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Button
                  title="Confirm"
                  onPress={confirmTransaction}
                  testID="Confirm.Button"
                />
              </View>
              <View style={styles.column}>
                <Button
                  title="Cancel"
                  onPress={cancelTransaction}
                  testID="Cancel.Button"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    paddingRight: 5,
    width: '50%',
  },
  textInput: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#919191',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
})

export default ReviewTransactionModal
