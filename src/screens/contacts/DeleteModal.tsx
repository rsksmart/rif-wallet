import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PrimaryButton from '../../components/button/PrimaryButton'
import { Modal } from '../../components/modal/Modal'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'

interface DeleteModalProps {
  isVisible: boolean
  text: string
  onOk: () => void
  onCancel: () => void
}

export const DeleteModal = ({
  isVisible,
  text,
  onOk,
  onCancel,
}: DeleteModalProps) => (
  <Modal isVisible={isVisible}>
    <Modal.Container style={styles.container}>
      <Modal.Body>
        <Text style={styles.text}>{text}</Text>
      </Modal.Body>
      <Modal.Footer>
        <View>
          <PrimaryButton
            style={styles.deleteButton}
            onPress={onOk}
            underlayColor={colors.blue}>
            <Text style={styles.deleteText}>Delete</Text>
          </PrimaryButton>
          <PrimaryButton
            style={styles.cancelButton}
            onPress={onCancel}
            underlayColor={colors.blue}>
            <Text style={styles.cancelText}>Cancel</Text>
          </PrimaryButton>
        </View>
      </Modal.Footer>
    </Modal.Container>
  </Modal>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.blue2,
  },
  text: {
    fontFamily: fonts.regular,
    textAlign: 'center',
    paddingHorizontal: 60,
    color: colors.text.primary,
  },
  deleteButton: {
    backgroundColor: colors.background.light,
    borderColor: colors.background.light,
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
  },
  deleteText: {
    fontFamily: fonts.regular,
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.darkPurple3,
  },
  cancelButton: {
    backgroundColor: colors.background.blue2,
    borderColor: colors.background.light,
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 8,
    paddingTop: 12,
  },
  cancelText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text.primary,
  },
})
