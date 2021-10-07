import React from 'react'
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native'
import { Header2 } from '../components/typography'
import { TransactionPartial } from './ReviewTransactionComponent'

interface Interface {
  modalVisible: boolean
  transaction: TransactionPartial | null
  closeModal: () => void
}

const ModalComponent: React.FC<Interface> = ({
  modalVisible,
  transaction,
  closeModal,
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => closeModal()}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Header2>Review Transaction</Header2>
            <Text style={styles.modalText}>{transaction?.to}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={closeModal}>
              <Text style={styles.textStyle}>Hide Modal</Text>
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
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})

export default ModalComponent
