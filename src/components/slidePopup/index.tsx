import { useKeyboard } from '@react-native-community/hooks'
import React from 'react'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'

import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { RegularText } from 'components/typography'
import { sharedColors } from 'src/shared/constants'
import { colors } from 'src/styles'

interface Props {
  children: React.ReactNode
  isVisible: boolean
  onModalClosed: () => void
  animateModal: boolean
  onAnimateModal: () => void
  backgroundColor: string
  headerFontColor: string
  showHideButton?: boolean
  height?: number
  duration?: number
}

const DEVICE_HEIGHT = Dimensions.get('window').height
const HEADER_HEIGHT = 63

export const SlidePopup = ({
  children,
  isVisible,
  onModalClosed,
  animateModal,
  onAnimateModal,
  backgroundColor,
  headerFontColor,
  showHideButton = true,
  height = DEVICE_HEIGHT / 2,
  duration = 450,
}: Props) => {
  const keyboard = useKeyboard()

  const containerStyle = !keyboard.keyboardShown
    ? styles.containerContent
    : { ...styles.containerContent, marginBottom: keyboard.keyboardHeight - 50 }

  const initialYScroll = keyboard.keyboardShown
    ? keyboard.keyboardHeight - 50
    : 0

  // calculate marginTop for header and content based on given height
  const commonMarginTop = DEVICE_HEIGHT - height
  const headerMarginTop = commonMarginTop
  const contentMarginTop = 63 + commonMarginTop

  return (
    <SwipeUpDownModal
      modalVisible={isVisible}
      duration={duration}
      PressToanimate={animateModal}
      HeaderContent={
        <View style={{ ...styles.containerHeader, backgroundColor }}>
          <View style={styles.handlerContainer}>
            <View style={styles.handler} />
          </View>
          <View style={styles.actionsContainer}>
            {showHideButton && (
              <TouchableOpacity
                accessibilityLabel="hide"
                onPress={onAnimateModal}>
                <RegularText
                  style={{ ...styles.action, color: headerFontColor }}>
                  hide
                </RegularText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      }
      HeaderStyle={{ marginTop: headerMarginTop }}
      ContentModal={
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={containerStyle}>
            <ScrollView contentOffset={{ x: 0, y: initialYScroll }}>
              {children}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      }
      ContentModalStyle={{
        ...styles.content,
        backgroundColor,
        marginTop: contentMarginTop,
      }}
      onClose={onModalClosed}
    />
  )
}

const styles = StyleSheet.create({
  containerContent: {
    marginHorizontal: 40,
  },
  containerHeader: {
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    height: HEADER_HEIGHT,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  handlerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  handler: {
    width: 64,
    height: 5,
    borderRadius: 5,
    marginTop: 24,
    backgroundColor: sharedColors.white,
    opacity: 0.3,
  },
  action: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 10,
    color: 'white',
  },
  swapper: {
    borderColor: colors.darkBlue,
    borderTopColor: colors.white,
    borderWidth: 2,
  },
  content: {
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
})
