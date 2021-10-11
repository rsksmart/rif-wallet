import React, { useState } from 'react'
import { Modal, StyleSheet, TextInput, View } from 'react-native'
import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'
import { TransactionPartial } from '../types/transaction'

export interface ReviewTransactionDataI {
  transaction: TransactionPartial
  handleConfirm: (transaction: TransactionPartial | null) => void
}

interface Interface {
  transaction: TransactionPartial
  closeModal: (transaction: TransactionPartial | null) => void
}

const ReviewTransactionModal: React.FC<Interface> = ({
  transaction,
  closeModal,
}) => {
  const [updateTransaction, setUpdateTransaction] =
    useState<TransactionPartial>({
      ...transaction,
      gasLimit: '10000',
      gasPrice: '0.068',
    })

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
                  onPress={() => closeModal(updateTransaction)}
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
