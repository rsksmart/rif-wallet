import { StyleSheet } from 'react-native'

import {
  AppButtonBackgroundVarietyEnum,
  AppButtonProps,
} from 'components/button'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { SlidePopupConfirmation } from './SlidePopupConfirmation'

interface Props {
  title: string
  description: string
  confirmText: string
  cancelText: string
  isVisible?: boolean
  height?: number
  onConfirm: () => void
  onCancel: () => void
}

export const SlidePopupConfirmationDanger = ({
  title,
  description,
  confirmText,
  cancelText,
  isVisible = true,
  height,
  onConfirm,
  onCancel,
}: Props) => {
  const confirmButton: AppButtonProps = {
    accessibilityLabel: 'confirmButton',
    style: styles.okButton,
    backgroundVariety: AppButtonBackgroundVarietyEnum.DEFAULT,
    color: sharedColors.black,
    title: confirmText,
    onPress: onConfirm,
  }

  const cancelButton: AppButtonProps = {
    accessibilityLabel: 'cancelButton',
    style: styles.cancelButton,
    backgroundVariety: AppButtonBackgroundVarietyEnum.GHOST,
    textColor: sharedColors.black,
    title: cancelText,
    onPress: onCancel,
  }

  return (
    <SlidePopupConfirmation
      title={title}
      description={description}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      isVisible={isVisible}
      showSlider={false}
      height={height}
      backgroundColor={sharedColors.dangerLight}
      buttons={[confirmButton, cancelButton]}
      onClose={onCancel}
    />
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({
    color: sharedColors.black,
  }),
  description: castStyle.text({
    color: sharedColors.black,
    opacity: 0.7,
  }),
  okButton: castStyle.view({
    marginBottom: 10,
  }),
  cancelButton: castStyle.view({
    marginBottom: 10,
    borderColor: sharedColors.black,
    borderWidth: 1,
  }),
})
