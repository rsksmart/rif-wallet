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
import { WINDOW_HEIGHT, sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { AppButton, AppButtonProps } from '../button'

interface Props extends ModalProps {
  title: string
  FeedbackComponent: ReactElement
  texts?: string[]
  style?: StyleProp<ViewStyle>
  backgroundColor?: ColorValue
  buttons?: AppButtonProps[]
}

export const FeedbackModal = ({
  FeedbackComponent,
  title,
  texts = [],
  visible,
  animationType,
  buttons,
  style,
  backgroundColor = sharedColors.black,
}: Props) => {
  const { top } = useSafeAreaInsets()
  return (
    <Modal animationType={animationType} visible={visible}>
      <View
        style={[styles.container, { paddingTop: top, backgroundColor }, style]}>
        <View style={styles.feedback}>{FeedbackComponent}</View>
        <View style={styles.content}>
          <Typography style={styles.title} type={'h2'}>
            {title}
          </Typography>
          {texts.map((text, i) => (
            <Typography
              style={styles.subtitle}
              type={'h4'}
              key={i}
              accessibilityLabel={`text-${i}`}>
              {text}
            </Typography>
          ))}
        </View>
      </View>
      <View style={styles.buttons}>
        {buttons?.map((button, i) => (
          <AppButton key={i} {...button} />
        ))}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flex: 1,
    paddingHorizontal: 24,
  }),
  feedback: castStyle.view({
    marginTop: WINDOW_HEIGHT * 0.15,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  }),
  content: castStyle.view({
    marginTop: WINDOW_HEIGHT * 0.15,
    alignItems: 'center',
    justifyContent: 'flex-end',
  }),
  title: castStyle.text({
    letterSpacing: -1,
    marginBottom: 8,
  }),
  subtitle: castStyle.text({
    marginTop: 5,
    color: sharedColors.labelLight,
  }),
  button: castStyle.view({
    marginTop: 8,
  }),
  buttons: castStyle.view({
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  }),
})
