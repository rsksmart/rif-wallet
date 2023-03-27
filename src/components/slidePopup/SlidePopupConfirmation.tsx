import { useState } from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native'

import { AppButton, AppButtonProps } from 'components/button'
import { Typography } from 'components/typography'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { SlidePopup } from './index'

const ANIMATION_DURATION = 250

interface Props {
  title: string
  description: string
  buttons: AppButtonProps[]
  backgroundColor?: string
  height?: number
  isVisible?: boolean
  showSlider?: boolean
  titleStyle?: StyleProp<TextStyle>
  descriptionStyle?: StyleProp<TextStyle>
  onClose: () => void
}

export const SlidePopupConfirmation = ({
  title,
  description,
  buttons,
  height,
  isVisible = true,
  showSlider = true,
  backgroundColor = sharedColors.primary,
  titleStyle,
  descriptionStyle,
  onClose,
}: Props) => {
  const [animateModal, setAnimateModal] = useState(false)

  const onButtonPress = (
    event: GestureResponderEvent,
    onPress: ((event: GestureResponderEvent) => void) | undefined,
  ) => {
    setAnimateModal(true)
    setTimeout(() => {
      setAnimateModal(false)
      onPress?.(event)
    }, ANIMATION_DURATION)
  }

  return (
    <SlidePopup
      isVisible={isVisible}
      duration={ANIMATION_DURATION}
      height={height}
      animateModal={animateModal}
      showSlider={showSlider}
      onClose={() => {
        setAnimateModal(false)
        onClose()
      }}
      backgroundColor={backgroundColor}>
      <View>
        <Typography type="h2" style={[styles.title, titleStyle]}>
          {title}
        </Typography>

        <Typography type="h3" style={[styles.description, descriptionStyle]}>
          {description}
        </Typography>

        {buttons.map((button, index) => (
          <AppButton
            key={index}
            accessibilityLabel={button.accessibilityLabel}
            style={button.style}
            backgroundVariety={button.backgroundVariety}
            color={button.color}
            textColor={button.textColor}
            title={button.title}
            onPress={e => onButtonPress(e, button.onPress)}
          />
        ))}
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
})
