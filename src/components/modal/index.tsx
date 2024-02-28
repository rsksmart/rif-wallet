import {
  ColorValue,
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import RNModal from 'react-native-modal'

import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { Typography } from '../typography'
import { AppButton, AppButtonBackgroundVarietyEnum } from '../button'

interface ModalProps {
  isVisible: boolean
  children: React.ReactNode
}

interface ModalChildrenProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
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

interface ConfirmationModalButtonConfig {
  color: ColorValue
  textColor: ColorValue
}

interface ConfirmationModalProps {
  isVisible: boolean
  title: string
  onOk: () => void
  onCancel?: () => void
  titleColor?: ColorValue
  buttons?: [ConfirmationModalButtonConfig, ConfirmationModalButtonConfig]
  backgroundColor?: ColorValue
  imgSource?: ImageSourcePropType
  description?: string
  descriptionColor?: ColorValue
  okText?: string
  cancelText?: string
}

export type ConfirmationModalConfig = Omit<ConfirmationModalProps, 'isVisible'>

export const ConfirmationModal = ({
  isVisible = true,
  title,
  titleColor = sharedColors.text.primary,
  description = '',
  descriptionColor = sharedColors.text.label,
  backgroundColor = sharedColors.primary,
  okText = 'OK',
  cancelText,
  onOk,
  onCancel,
  imgSource,
  buttons,
}: ConfirmationModalProps) => (
  <Modal isVisible={isVisible}>
    <Modal.Container
      style={[
        styles.confirmationModalContainer,
        backgroundColor ? { backgroundColor } : null,
      ]}>
      <View style={styles.footerBarIndicator} />
      <Modal.Body>
        {imgSource ? <Image source={imgSource} style={styles.image} /> : null}
        <Typography
          type={'h3'}
          style={sharedStyles.textCenter}
          color={titleColor}>
          {title}
        </Typography>
        {description && (
          <Typography
            type={'body3'}
            color={descriptionColor}
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
          color={buttons && buttons[0] ? buttons[0].color : sharedColors.white}
          textColor={
            buttons && buttons[0] ? buttons[0].textColor : sharedColors.black
          }
        />
        {cancelText && (
          <AppButton
            style={styles.cancelButton}
            title={cancelText}
            onPress={onCancel}
            accessibilityLabel={'cancelText'}
            backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
            color={
              buttons && buttons[1] ? buttons[1].color : sharedColors.white
            }
            textColor={
              buttons && buttons[1] ? buttons[1].textColor : sharedColors.white
            }
          />
        )}
      </Modal.Footer>
    </Modal.Container>
  </Modal>
)

const modalStyles = StyleSheet.create({
  container: castStyle.view({
    borderRadius: 25,
    borderWidth: 0,
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
  image: castStyle.image({
    width: '70%',
    height: '100%',
    alignSelf: 'center',
  }),
  description: castStyle.text({
    marginTop: 12,
    textAlign: 'center',
  }),
  cancelButton: castStyle.view({ width: '100%', marginTop: 6 }),
})
