import React from 'react'
import SwipeUpDownModal from 'react-native-swipe-modal-up-down'
import { useKeyboard } from '@react-native-community/hooks'

import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import { colors } from 'src/styles'
import { RegularText } from 'components/typography'

interface Props {
  title?: string
  children: React.ReactNode
  showSelector: boolean
  onModalClosed: () => void
  animateModal: boolean
  onAnimateModal: () => void
  backgroundColor: string
  headerFontColor: string
  showHideButton?: boolean
}

export const SlidePopup = ({
  title,
  children,
  showSelector,
  onModalClosed,
  animateModal,
  onAnimateModal,
  backgroundColor,
  headerFontColor,
  showHideButton = true,
}: Props) => {
  const keyboard = useKeyboard()

  const containerStyle = !keyboard.keyboardShown
    ? styles.containerContent
    : { ...styles.containerContent, marginBottom: keyboard.keyboardHeight - 50 }

  const initialYScroll = keyboard.keyboardShown
    ? keyboard.keyboardHeight - 50
    : 0
  return (
    <SwipeUpDownModal
      modalVisible={showSelector}
      PressToanimate={animateModal}
      //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
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
      HeaderStyle={styles.headerContent}
      ContentModalStyle={{ ...styles.Modal, backgroundColor }}
      HeaderContent={
        <View style={{ ...styles.containerHeader, backgroundColor }}>
          <View style={styles.handlerContainer}>
            <View
              style={{ ...styles.handler, backgroundColor: headerFontColor }}
            />
          </View>
          <View style={styles.actionsContainer}>
            <View>
              <RegularText style={{ ...styles.action, color: headerFontColor }}>
                {title}
              </RegularText>
            </View>
            {showHideButton && (
              <TouchableOpacity
                accessibilityLabel="hide"
                onPress={() => {
                  onAnimateModal()
                }}>
                <RegularText
                  style={{ ...styles.action, color: headerFontColor }}>
                  hide
                </RegularText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      }
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
    height: 70,
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
    height: 4,
    borderRadius: 5,
    width: 50,
    marginTop: 15,
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
  headerContent: {
    marginTop: 100 + 300,
  },
  Modal: {
    marginTop: 170 + 300,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
})
