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

import { Typography } from 'components/typography'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'src/shared/utils'

import { AppButton, AppButtonProps } from '../button'

interface Props extends ModalProps {
  title: string
  feedbackComponent: ReactElement
  subtitle?: string
  description?: string
  style?: StyleProp<ViewStyle>
  backgroundColor?: ColorValue
  buttons?: AppButtonProps[]
}

export const FeedbackModal = ({
  feedbackComponent,
  title,
  subtitle,
  description,
  visible,
  animationType,
  buttons = [],
  style,
  backgroundColor = sharedColors.primary,
}: Props) => {
  return (
    <Modal animationType={animationType} visible={visible}>
      <View style={[styles.container, { backgroundColor }, style]}>
        <View style={styles.header}>{feedbackComponent}</View>
        <View style={styles.content}>
          <Typography type="h2" color={sharedColors.white}>
            {title}
          </Typography>
          <Typography
            type="h3"
            color={sharedColors.white}
            style={styles.subtitle}>
            {subtitle}
          </Typography>
          <Typography
            type="h4"
            color={sharedColors.white}
            style={styles.description}>
            {description}
          </Typography>
        </View>
        <View style={styles.footer}>
          {buttons.map((button, index) => (
            <AppButton
              key={index}
              {...button}
              style={[styles.button, button.style]}
              textStyle={[styles.buttonText, button.textStyle]}
            />
          ))}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  header: castStyle.view({
    flex: 3,
    justifyContent: 'flex-end',
  }),
  content: castStyle.view({
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  }),
  subtitle: castStyle.text({
    marginTop: 10,
    color: sharedColors.labelLight,
  }),
  description: castStyle.text({
    marginTop: 30,
  }),
  footer: castStyle.view({
    flex: 2,
    justifyContent: 'center',
  }),
  button: castStyle.view({
    width: '75%',
    marginTop: 8,
  }),
  buttonText: castStyle.text({
    flex: 1,
    textAlign: 'center',
  }),
})
