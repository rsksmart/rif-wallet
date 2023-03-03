import { Typography } from 'components/typography'
import { useState } from 'react'
import { View } from 'react-native'
import { sharedColors } from 'src/shared/constants'
import { colors } from 'src/styles'
import { SlidePopup } from './index'
import { PrimaryButton, SecondaryButton } from '../button'

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
      animateModal={animateModal}
      onAnimateModal={() => setAnimateModal(true)}
      onModalClosed={() => setAnimateModal(false)}
      backgroundColor={sharedColors.primary}
      headerFontColor={colors.white}
      showHideButton={false}>
      <View>
        <Typography
          type="h2"
          style={{
            color: colors.white,
            textAlign: 'center',
            marginBottom: 20,
          }}>
          {title}
        </Typography>

        <Typography
          type="h3"
          style={{
            color: colors.white,
            textAlign: 'center',
            marginBottom: 20,
          }}>
          {description}
        </Typography>

        <PrimaryButton
          style={{
            borderColor: colors.background.light,
            borderWidth: 1,
            marginBottom: 10,
            paddingVertical: 10,
            paddingHorizontal: 50,
          }}
          title={okText}
          onPress={onOk}
          accessibilityLabel="okText"
        />

        {cancelText && (
          <SecondaryButton
            style={{
              marginBottom: 10,
              paddingVertical: 10,
              paddingHorizontal: 50,
            }}
            title={'CANCEL'}
            onPress={onOk}
            accessibilityLabel="cancelText"
          />
        )}
      </View>
    </SlidePopup>
  )
}
