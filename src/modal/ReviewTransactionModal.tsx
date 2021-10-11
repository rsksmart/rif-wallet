import React, { useState } from 'react'
import { Modal, StyleSheet, TextInput, View } from 'react-native'
import { Transaction } from '@rsksmart/rlogin-eip1193-types'

import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'

export interface ReviewTransactionDataI {
  transaction: Transaction
  handleConfirm: (transaction: Transaction | null) => void
}

/**
 * Used for UI only to make editing transactions easier. Allows for
 * gasPrice to be '0.', '0.0', or blank, as the user types it in.
 */
interface StringTransaction {
  to: string
  from?: string
  value?: string | number
  data?: string
  gasLimit: string // string for easier editing below
  gasPrice: string
}

interface Interface {
  transaction: Transaction
  closeModal: (transaction: Transaction | null) => void
}

const ReviewTransactionModal: React.FC<Interface> = ({
  transaction,
  closeModal,
}) => {
  const [updateTransaction, setUpdateTransaction] = useState<StringTransaction>(
    {
      to: transaction.to,
      from: transaction.from,
      value: transaction.value,
      data: transaction.data,
      gasLimit: transaction.gasLimit ? transaction.gasLimit.toString() : '',
      gasPrice: transaction.gasPrice ? transaction.gasPrice.toString() : '',
    },
  )

  // gasLimit can be a number or empty (temporarly)
  const changeGasLimit = (gasLimit: string) => {
    if (parseInt(gasLimit, 10).toString() === gasLimit || gasLimit === '') {
      setUpdateTransaction({
        ...updateTransaction,
        gasLimit: gasLimit,
      })
    }
  }

  // gasPrice is an integer that temporarly can end with 0 or a dot
  const changeGasPrice = (gasPrice: string) => {
    if (gasPrice.match(/^(\d*)([,.]\d{0,})?$/)) {
      setUpdateTransaction({
        ...updateTransaction,
        gasPrice: gasPrice,
      })
    }
  }

  // convert from string to Transaction and pass out of component
  const confirmTransaction = () => {
    closeModal({
      ...updateTransaction,
      gasLimit: parseInt(updateTransaction.gasLimit, 10),
      gasPrice: parseFloat(updateTransaction.gasPrice),
    })
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={true}
        onRequestClose={() => closeModal(null)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Header2>Review Transaction</Header2>
            <Paragraph>to: {transaction?.to}</Paragraph>
            <Paragraph>from: {transaction?.from}</Paragraph>
            <Paragraph>value: {transaction?.value}</Paragraph>

            <View style={styles.row}>
              <View style={styles.column}>
                <Paragraph>gas limit:</Paragraph>
              </View>
              <View style={styles.column}>
                <TextInput
                  value={updateTransaction.gasLimit?.toString()}
                  style={styles.textInput}
                  onChangeText={changeGasLimit}
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
                  value={updateTransaction.gasPrice?.toString()}
                  style={styles.textInput || ''}
                  onChangeText={changeGasPrice}
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
                  onPress={() => closeModal(null)}
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
