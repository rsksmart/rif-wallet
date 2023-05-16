import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import RNModal from 'react-native-modal'

import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import { sharedColors, sharedStyles } from 'src/shared/constants'
import { castStyle } from 'src/shared/utils'

import { Typography } from '../typography'
import { AppButton, AppButtonBackgroundVarietyEnum } from '../button'

interface ModalProps {
  isVisible: boolean
  children: React.ReactNode
}

interface ModalChildrenProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const Modal = ({
  isVisible = false,
  children,
  ...props
}: ModalProps) => (
  <RNModal
    isVisible={isVisible}
    animationIn="fadeIn"
    animationOut="fadeOut"
    animationInTiming={200}
    animationOutTiming={200}
    {...props}>
    {children}
  </RNModal>
)

const ModalContainer = ({ children, style }: ModalChildrenProps) => (
  <View style={[modalStyles.container, style]}>{children}</View>
)

const ModalHeader = ({ title }: { title: string }) => (
  <View style={modalStyles.header}>
    <Typography type={'h3'}>{title}</Typography>
  </View>
)

const ModalBody = ({ children, style }: ModalChildrenProps) => (
  <View style={[modalStyles.body, style]}>{children}</View>
)

const ModalFooter = ({ children, style }: ModalChildrenProps) => (
  <View style={[modalStyles.footer, style]}>{children}</View>
)

Modal.Header = ModalHeader
Modal.Container = ModalContainer
Modal.Body = ModalBody
Modal.Footer = ModalFooter

interface ConfirmationModalProps {
  title: string
  imgSource?: ImageSourcePropType
  onOk: () => void
  onCancel?: () => void
  isVisible?: boolean
  description?: string
  okText?: string
  cancelText?: string
}

export const ConfirmationModal = ({
  isVisible = true,
  title,
  description = '',
  okText = 'OK',
  cancelText,
  onOk,
  onCancel,
  imgSource,
}: ConfirmationModalProps) => (
  <Modal isVisible={isVisible}>
    <Modal.Container style={styles.confirmationModalContainer}>
      <View style={styles.footerBarIndicator} />
      <Modal.Body>
        {imgSource ? <Image source={imgSource} style={styles.image} /> : null}
        <Typography type={'h3'} style={sharedStyles.textCenter}>
          {title}
        </Typography>
        {description && (
          <Typography
            type={'body2'}
            color={sharedColors.labelLight}
            style={styles.description}>
            {description}
          </Typography>
        )}
      </Modal.Body>
      <Modal.Footer>
        <AppButton
          title={okText}
          onPress={onOk}
          accessibilityLabel={'okText'}
          color={sharedColors.white}
          textColor={sharedColors.black}
        />
        {cancelText && (
          <AppButton
            style={styles.cancelButton}
            title={cancelText}
            onPress={onCancel}
            accessibilityLabel={'cancelText'}
            backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
            color={sharedColors.white}
          />
        )}
      </Modal.Footer>
    </Modal.Container>
  </Modal>
)

const modalStyles = StyleSheet.create({
  container: castStyle.view({
    backgroundColor: '#ffffff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    padding: 15,
  }),
  header: castStyle.view({
    alignItems: 'center',
    justifyContent: 'center',
  }),
  text: castStyle.text({
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 24,
  }),
  body: castStyle.view({
    marginTop: 24,
    justifyContent: 'center',
    paddingHorizontal: 4,
  }),
  footer: castStyle.view({
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  }),
})

const styles = StyleSheet.create({
  footerBarIndicator: castStyle.view({
    width: 64,
    height: 5,
    backgroundColor: sharedColors.white,
    opacity: 0.3,
  }),
  confirmationModalContainer: castStyle.view({
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: sharedColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  }),
  image: {
    width: '70%',
    height: '100%',
    alignSelf: 'center',
  },
  title: castStyle.text({
    fontFamily: fonts.regular,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 60,
    color: colors.text.primary,
  }),
  description: castStyle.text({
    marginTop: 12,
    textAlign: 'center',
  }),
  cancelButton: castStyle.view({ width: '100%', marginTop: 6 }),
})
