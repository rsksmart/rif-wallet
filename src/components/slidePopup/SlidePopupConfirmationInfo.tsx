import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { AppButton, AppButtonBackgroundVarietyEnum } from 'components/button'
import { Typography } from 'components/typography'
import { sharedColors } from 'src/shared/constants'
import { castStyle } from 'src/shared/utils'
import { colors } from 'src/styles'
import { SlidePopup } from './index'

const ANIMATION_DURATION = 250

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
  const [animateModal, setAnimateModal] = useState(false)

  return (
    <SlidePopup
      isVisible={isVisible}
      duration={ANIMATION_DURATION}
      height={height}
      animateModal={animateModal}
      onClose={() => {
        setAnimateModal(false)
        onConfirm()
      }}
      backgroundColor={sharedColors.primary}>
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
          backgroundVariety={AppButtonBackgroundVarietyEnum.GHOST}
          title={confirmText}
          onPress={() => {
            setAnimateModal(true)
            setInterval(() => {
              setAnimateModal(false)
              onConfirm()
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
    color: sharedColors.subTitle,
  }),
  description: castStyle.text({
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    color: sharedColors.labelLight,
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
