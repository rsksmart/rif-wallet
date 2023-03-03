import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { sharedColors } from 'src/shared/constants'
import { Typography } from 'components/typography'
import { colors } from 'src/styles'
import { SlidePopup } from './index'
import { PrimaryButton, SecondaryButton } from '../button'
import { castStyle } from 'src/shared/utils'

const ANIMATION_DURATION = 250

interface Props {
  isVisible?: boolean
  title: string
  description: string
  okText?: string
  cancelText?: string
  onOk: () => void
  onCancel?: () => void
}

export const SlidePopupConfirmation = ({
  isVisible = true,
  title,
  description,
  okText = 'OK',
  cancelText,
  onOk,
  onCancel,
}: Props) => {
  const [animateModal, setAnimateModal] = useState(false)

  return (
    <SlidePopup
      isVisible={isVisible}
      duration={ANIMATION_DURATION}
      height={400}
      animateModal={animateModal}
      onAnimateModal={() => setAnimateModal(true)}
      onModalClosed={() => {
        setAnimateModal(false)
        onOk()
      }}
      backgroundColor={sharedColors.primary}
      headerFontColor={sharedColors.inputLabelColor}
      showHideButton={false}>
      <View>
        <Typography type="h2" style={styles.title}>
          {title}
        </Typography>

        <Typography type="h3" style={styles.description}>
          {description}
        </Typography>

        <PrimaryButton
          style={styles.okButton}
          title={okText}
          onPress={() => {
            setAnimateModal(true)
            setInterval(() => {
              setAnimateModal(false)
              onOk()
            }, ANIMATION_DURATION)
          }}
          accessibilityLabel="okText"
        />

        {cancelText && (
          <SecondaryButton
            style={styles.cancelButton}
            title={'CANCEL'}
            onPress={() => {
              setAnimateModal(true)
              setInterval(() => {
                setAnimateModal(false)
                onCancel?.()
              }, ANIMATION_DURATION)
            }}
            accessibilityLabel="cancelText"
          />
        )}
      </View>
    </SlidePopup>
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({
    fontSize: 20,
    color: sharedColors.subTitle,
    textAlign: 'center',
    marginBottom: 12,
  }),
  description: castStyle.text({
    fontSize: 15,
    color: sharedColors.labelLight,
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
