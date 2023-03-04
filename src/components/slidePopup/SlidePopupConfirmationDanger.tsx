import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton, AppButtonBackgroundVarietyEnum } from 'components/button'
import { Typography } from 'components/typography'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { SlidePopup } from './index'

const ANIMATION_DURATION = 250

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
  confirmText,
  cancelText,
  description,
  isVisible = true,
  height,
  onConfirm,
  onCancel,
}: Props) => {
  const [animateModal, setAnimateModal] = useState(false)

  return (
    <SlidePopup
      isVisible={isVisible}
      duration={ANIMATION_DURATION}
      height={height}
      animateModal={animateModal}
      showSwapper={false}
      onClose={() => {
        setAnimateModal(false)
        onCancel()
      }}
      backgroundColor={sharedColors.dangerLight}>
      <View>
        <Typography type="h2" style={styles.title}>
          {title}
        </Typography>

        <Typography type="h3" style={styles.description}>
          {description}
        </Typography>

        <AppButton
          accessibilityLabel="confirmButton"
          style={styles.okButton}
          backgroundVariety={AppButtonBackgroundVarietyEnum.DEFAULT}
          color={sharedColors.black}
          title={confirmText}
          onPress={() => {
            setAnimateModal(true)
            setTimeout(() => {
              setAnimateModal(false)
              onConfirm()
            }, ANIMATION_DURATION)
          }}
        />

        <AppButton
          accessibilityLabel="cancelButton"
          style={styles.cancelButton}
          backgroundVariety={AppButtonBackgroundVarietyEnum.GHOST}
          textColor={sharedColors.black}
          title={cancelText}
          onPress={() => {
            setAnimateModal(true)
            setTimeout(() => {
              setAnimateModal(false)
              onCancel()
            }, ANIMATION_DURATION)
          }}
        />
      </View>
    </SlidePopup>
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
    color: sharedColors.black,
  }),
  description: castStyle.text({
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    color: sharedColors.black,
  }),
  okButton: castStyle.view({
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
  }),
  cancelButton: castStyle.view({
    borderColor: sharedColors.black,
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
  }),
})
