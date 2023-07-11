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

import { Typography } from 'components/typography'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { AppButton, AppButtonProps } from '../button'

interface Props extends ModalProps {
  title: string
  FeedbackComponent: ReactElement
  texts?: string[]
  footerText?: string
  style?: StyleProp<ViewStyle>
  backgroundColor?: ColorValue
  buttons?: AppButtonProps[]
  loading?: boolean
}

export const FeedbackModal = ({
  FeedbackComponent,
  title,
  texts = [],
  footerText,
  visible,
  animationType,
  buttons,
  style,
  backgroundColor,
  loading,
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
        <View style={styles.feedback}>{FeedbackComponent}</View>
        {!loading && (
          <View style={styles.content}>
            <Typography style={styles.title} type={'h2'}>
              {title}
            </Typography>
            {texts.map((text, i) => (
              <Typography style={styles.subtitle} type={'h4'} key={i}>
                {text}
              </Typography>
            ))}
            {footerText ? (
              <Typography style={styles.footerText} type={'body3'}>
                {footerText}
              </Typography>
            ) : null}
            <View style={styles.buttons}>
              {buttons
                ? buttons.map((button, index) => (
                    <AppButton
                      key={index}
                      {...button}
                      style={styles.button}
                      textStyle={{ textAlign: 'center' }}
                    />
                  ))
                : null}
            </View>
          </View>
        )}
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
  feedback: castStyle.view({
    flex: 1,
    justifyContent: 'flex-end',
  }),
  content: castStyle.view({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  buttons: castStyle.view({
    justifyContent: 'center',
    minHeight: 100,
    alignSelf: 'stretch',
  }),
  button: castStyle.view({
    marginTop: 8,
  }),
})
