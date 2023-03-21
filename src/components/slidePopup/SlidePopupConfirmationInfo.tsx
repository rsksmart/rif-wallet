import { StyleSheet } from 'react-native'

import {
  AppButtonBackgroundVarietyEnum,
  AppButtonProps,
} from 'components/button'
import { noop, sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { SlidePopupConfirmation } from './SlidePopupConfirmation'

interface Props {
  title: string
  description: string
  confirmText: string
  cancelText?: string
  isVisible?: boolean
  height?: number
  onConfirm: () => void
  onCancel?: () => void
  onClose?: () => void
}

export const SlidePopupConfirmationInfo = ({
  title,
  description,
  confirmText,
  cancelText,
  isVisible = true,
  height,
  onConfirm,
  onCancel,
  onClose = onCancel || onConfirm,
}: Props) => {
  const confirmButton: AppButtonProps = {
    accessibilityLabel: 'confirmButton',
    style: styles.secondaryButton,
    backgroundVariety: AppButtonBackgroundVarietyEnum.GHOST,
    title: confirmText,
    onPress: onConfirm,
  }
  const buttons = [confirmButton]
  if (cancelText) {
    const cancelButton: AppButtonProps = {
      accessibilityLabel: 'cancelButton',
      style: styles.secondaryButton,
      backgroundVariety: AppButtonBackgroundVarietyEnum.GHOST,
      title: cancelText,
      onPress: onCancel,
    }

    confirmButton.style = styles.primaryButton
    confirmButton.textColor = sharedColors.black

    buttons.push(cancelButton)
  }

  return (
    <SlidePopupConfirmation
      title={title}
      description={description}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      isVisible={isVisible}
      height={height}
      backgroundColor={sharedColors.primary}
      buttons={buttons}
      onClose={onClose}
    />
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({
    color: sharedColors.subTitle,
  }),
  description: castStyle.text({
    color: sharedColors.labelLight,
  }),
  primaryButton: castStyle.view({
    backgroundColor: sharedColors.white,
    marginBottom: 10,
  }),
  secondaryButton: castStyle.view({
    borderColor: sharedColors.white,
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
  }),
})
