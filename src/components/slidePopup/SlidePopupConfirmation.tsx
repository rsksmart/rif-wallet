import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  AppButton,
  AppButtonBackgroundVarietyEnum,
  SecondaryButton,
} from 'components/button'
import { Typography } from 'components/typography'
import { sharedColors } from 'src/shared/constants'
import { castStyle } from 'src/shared/utils'
import { colors } from 'src/styles'
import { SlidePopup } from './index'

const ANIMATION_DURATION = 250

export enum SlidePopupConfirmationType {
  INFO,
  DANGER,
}

interface Props {
  title: string
  description: string
  type?: SlidePopupConfirmationType
  isVisible?: boolean
  height?: number
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  onClose: () => void
}

export const SlidePopupConfirmation = ({
  title,
  description,
  type = SlidePopupConfirmationType.INFO,
  isVisible = true,
  height,
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
  onClose,
}: Props) => {
  const [animateModal, setAnimateModal] = useState(false)

  let headerColor = sharedColors.subTitle
  let backgroundColor = sharedColors.primary
  let descriptionColor = sharedColors.labelLight
  let confirmButtonVariety = AppButtonBackgroundVarietyEnum.GHOST
  const confirmButtonColor = 'black'

  if (type === SlidePopupConfirmationType.DANGER) {
    headerColor = sharedColors.black
    descriptionColor = sharedColors.black
    backgroundColor = sharedColors.dangerLight
    confirmButtonVariety = AppButtonBackgroundVarietyEnum.DEFAULT
  }

  return (
    <SlidePopup
      isVisible={isVisible}
      duration={ANIMATION_DURATION}
      height={height}
      animateModal={animateModal}
      onClose={() => {
        setAnimateModal(false)
        onClose()
      }}
      backgroundColor={backgroundColor}>
      <View>
        <Typography type="h2" style={{ ...styles.title, color: headerColor }}>
          {title}
        </Typography>

        <Typography
          type="h3"
          style={{ ...styles.description, color: descriptionColor }}>
          {description}
        </Typography>

        <AppButton
          style={styles.okButton}
          backgroundVariety={confirmButtonVariety}
          color={confirmButtonColor}
          title={confirmText}
          onPress={() => {
            setAnimateModal(true)
            setInterval(() => {
              setAnimateModal(false)
              onConfirm()
            }, ANIMATION_DURATION)
          }}
          accessibilityLabel="confirmButton"
        />

        {cancelText && (
          <AppButton
            style={styles.cancelButton}
            title={'CANCEL'}
            onPress={() => {
              setAnimateModal(true)
              setInterval(() => {
                setAnimateModal(false)
                onCancel?.()
              }, ANIMATION_DURATION)
            }}
            accessibilityLabel="cancelButton"
          />
        )}
      </View>
    </SlidePopup>
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
  }),
  description: castStyle.text({
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  }),
  okButton: castStyle.view({
    borderColor: colors.background.light,
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
  }),
  cancelButton: castStyle.view({
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
  }),
})
