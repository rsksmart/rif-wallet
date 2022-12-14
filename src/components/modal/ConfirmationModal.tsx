import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Modal } from 'src/components/modal/Modal'
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import { PrimaryButton } from '../button/PrimaryButton'
import { SecondaryButton } from '../button/SecondaryButton'

interface ConfirmationModalProps {
  isVisible?: boolean
  imgSrc?: ImageSourcePropType
  title: string
  description?: string
  okText?: string
  cancelText?: string
  onOk: () => void
  onCancel?: () => void
}

export const ConfirmationModal = ({
  isVisible = true,
  imgSrc,
  title,
  description = '',
  okText = 'OK',
  cancelText,
  onOk,
  onCancel,
}: ConfirmationModalProps) => (
  <Modal isVisible={isVisible}>
    <Modal.Container style={styles.container}>
      <Modal.Body>
        {imgSrc && (
          <View style={styles.imageView}>
            <Image source={imgSrc} style={styles.image} />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </Modal.Body>
      <Modal.Footer>
        <View>
          <PrimaryButton
            style={styles.okButton}
            title={okText}
            onPress={onOk}
            accessibilityLabel="okText"
          />
          {cancelText && (
            <SecondaryButton
              style={styles.cancelButton}
              title={cancelText}
              onPress={onCancel}
              accessibilityLabel="cancelText"
            />
          )}
        </View>
      </Modal.Footer>
    </Modal.Container>
  </Modal>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.blue2,
  },
  imageView: {
    backgroundColor: colors.background.purple,
    borderRadius: 40,
    width: 75,
    height: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  image: {
    width: '70%',
    height: '100%',
    alignSelf: 'center',
  },
  title: {
    fontFamily: fonts.regular,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 60,
    color: colors.text.primary,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    color: colors.text.primary,
  },
  okButton: {
    borderColor: colors.background.light,
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  okText: {
    fontFamily: fonts.regular,
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.darkPurple3,
  },
  cancelButton: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  cancelText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text.primary,
  },
})
