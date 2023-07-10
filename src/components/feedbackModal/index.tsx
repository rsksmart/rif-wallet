import { ReactElement } from 'react'
import {
  ColorValue,
  Modal,
  ModalProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { castStyle } from 'shared/utils'
import { sharedColors } from 'shared/constants'
import { Typography } from 'components/typography'

import { AppButton, AppButtonProps } from '../button'

interface Props extends ModalProps {
  title: string
  FeedbackComponent: ReactElement
  content?: string[]
  footerText?: string
  style?: StyleProp<ViewStyle>
  backgroundColor?: ColorValue
  buttons?: AppButtonProps[]
}

export const FeedbackModal = ({
  FeedbackComponent,
  title,
  content = [],
  footerText,
  visible,
  animationType,
  buttons,
  style,
  backgroundColor,
}: Props) => {
  const { top } = useSafeAreaInsets()
  return (
    <Modal animationType={animationType} visible={visible}>
      <View
        style={[
          styles.container,
          { paddingTop: top },
          backgroundColor ? { backgroundColor } : null,
          style,
        ]}>
        {FeedbackComponent}
        <Typography style={styles.title} type={'h2'}>
          {title}
        </Typography>
        {content.map((text, i) => (
          <Typography style={styles.subtitle} type={'h4'} key={i}>
            {text}
          </Typography>
        ))}
        {footerText ? (
          <Typography style={styles.footerText} type={'body3'}>
            {footerText}
          </Typography>
        ) : null}
        <View style={styles.buttonsContainer}>
          {buttons
            ? buttons.map((button, index) => (
                <AppButton key={index} {...button} style={styles.button} />
              ))
            : null}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.primary,
    alignItems: 'center',
  }),
  title: castStyle.text({
    letterSpacing: -1,
    marginTop: 158,
    marginBottom: 8,
  }),
  subtitle: castStyle.text({
    marginTop: 5,
    color: sharedColors.labelLight,
  }),
  footerText: castStyle.text({
    marginTop: 30,
    color: sharedColors.labelLight,
  }),
  primaryButton: castStyle.view({
    position: 'absolute',
    bottom: 30,
    left: 22,
    right: 22,
    backgroundColor: sharedColors.white,
  }),
  buttonsContainer: castStyle.view({
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  }),
  button: castStyle.view({
    marginTop: 8,
  }),
})
