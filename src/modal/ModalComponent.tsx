import React from 'react'
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native'
import { Header2, Paragraph } from '../components/typography'
import { TransactionPartial } from './ReviewTransactionComponent'

export interface ReviewTransactionDataI {
  transaction: TransactionPartial
  handleConfirm: (transaction: TransactionPartial | null) => void
}

interface Interface {
  transactionData: ReviewTransactionDataI
  closeModal: (transaction: TransactionPartial | null) => void
}

const ModalComponent: React.FC<Interface> = ({
  transactionData,
  closeModal,
}) => {
  console.log('transactionData', transactionData)
  const { transaction } = transactionData

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

            <Pressable style={styles.button} onPress={() => closeModal(null)}>
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => closeModal(transaction)}>
              <Text>Confirm</Text>
            </Pressable>
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#F194FF',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})

export default ModalComponent
