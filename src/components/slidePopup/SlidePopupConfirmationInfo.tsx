import { StyleSheet } from 'react-native'

import {
  AppButtonBackgroundVarietyEnum,
  AppButtonProps,
} from 'components/button'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { colors } from 'src/styles'
import { SlidePopupConfirmation } from './SlidePopupConfirmation'

interface Props {
  title: string
  description: string
  confirmText: string
  isVisible?: boolean
  height?: number
  onConfirm: () => void
}

export const SlidePopupConfirmationInfo = ({
  title,
  description,
  confirmText,
  isVisible = true,
  height,
  onConfirm,
}: Props) => {
  const confirmButton: AppButtonProps = {
    accessibilityLabel: 'confirmButton',
    style: styles.okButton,
    backgroundVariety: AppButtonBackgroundVarietyEnum.GHOST,
    title: confirmText,
    onPress: onConfirm,
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
      buttons={[confirmButton]}
      onClose={onConfirm}
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
  okButton: castStyle.view({
    borderColor: colors.background.light,
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
  }),
})
