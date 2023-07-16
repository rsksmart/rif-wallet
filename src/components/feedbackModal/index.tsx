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
  style?: StyleProp<ViewStyle>
  backgroundColor?: ColorValue
  buttons?: AppButtonProps[]
  loading?: boolean
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
  loading,
}: Props) => {
  const { top } = useSafeAreaInsets()
  return (
    <Modal animationType={animationType} visible={visible}>
      <View
        style={[styles.container, { paddingTop: top, backgroundColor }, style]}>
        <View style={styles.feedback}>{FeedbackComponent}</View>
        <View style={styles.content}>
          {!loading && (
            <>
              <Typography style={styles.title} type={'h2'}>
                {title}
              </Typography>
              {texts.map((text, i) => (
                <Typography style={styles.subtitle} type={'h4'} key={i}>
                  {text}
                </Typography>
              ))}
              <View style={styles.buttons}>
                {buttons?.map((button, i) => (
                  <AppButton key={i} style={styles.button} {...button} />
                ))}
              </View>
            </>
          )}
        </View>
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
    flex: 1,
    alignSelf: 'center',
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
  buttons: castStyle.view({
    justifyContent: 'center',
    minHeight: 100,
    alignSelf: 'stretch',
  }),
  button: castStyle.view({
    marginTop: 8,
  }),
})
