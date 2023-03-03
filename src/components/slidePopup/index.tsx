import { useKeyboard } from '@react-native-community/hooks'
import React from 'react'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'

import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { sharedColors } from 'src/shared/constants'
import { castStyle } from 'src/shared/utils'

interface Props {
  children: React.ReactNode
  isVisible: boolean
  animateModal: boolean
  backgroundColor: string
  height?: number
  duration?: number
  onClose: () => void
}

const DEVICE_HEIGHT = Dimensions.get('window').height
const HEADER_HEIGHT = 50

export const SlidePopup = ({
  children,
  isVisible,
  animateModal,
  backgroundColor,
  height = DEVICE_HEIGHT / 2,
  duration = 450,
  onClose,
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
  const contentMarginTop = HEADER_HEIGHT + commonMarginTop

  return (
    <SwipeUpDownModal
      modalVisible={isVisible}
      duration={duration}
      PressToanimate={animateModal}
      HeaderContent={
        <View style={{ ...styles.containerHeader, backgroundColor }}>
          <View style={styles.swapper} />
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
      onClose={onClose}
    />
  )
}

const styles = StyleSheet.create({
  containerContent: castStyle.view({
    marginHorizontal: 28,
  }),
  containerHeader: castStyle.view({
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginHorizontal: 20,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
  }),
  swapper: castStyle.view({
    width: 64,
    height: 5,
    borderRadius: 5,
    marginTop: 24,
    backgroundColor: sharedColors.white,
    opacity: 0.3,
  }),
  content: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginHorizontal: 20,
  },
})
