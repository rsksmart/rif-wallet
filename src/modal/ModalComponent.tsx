import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { Request } from '../lib/core/RIFWallet'
import ReviewTransactionModal from './ReviewTransactionModal'
import SignMessageModal from './SignMessageModal'

interface Interface {
  request: Request
  closeModal: () => void
}

const ModalComponent: React.FC<Interface> = ({ request, closeModal }) => {
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={false} visible={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {request.type === 'signMessage' ? (
              <SignMessageModal request={request} closeModal={closeModal} />
            ) : (
              <ReviewTransactionModal
                request={request}
                closeModal={closeModal}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export const styles = StyleSheet.create({
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

export default ModalComponent
