import React from 'react'
import { KeyPad } from '../../keyPad'
import { StyleSheet, View } from 'react-native'
import DotsComponentDefault from './DotsComponent'
import { shareStyles } from '../../sharedStyles'
import { PinScreenType, DotsComponentDefaultType } from './PinScreen'
import MessageComponentDefault from './MessageComponent'
import { colors } from '../../../styles'

const PinScreen: React.FC<PinScreenType & DotsComponentDefaultType> = ({
  MessageComponent = MessageComponentDefault,
  DotsComponent = DotsComponentDefault,
  KeypadComponent = KeyPad,
  onKeypadDelete,
  onKeypadPress,
  pin,
  error = null,
}) => {
  return (
    <View style={[shareStyles.coverAllScreen, styles.container]}>
      <View style={styles.messageView}>
        <MessageComponent message={error || undefined} />
      </View>
      <View style={styles.dotsView}>
        <DotsComponent pin={pin} />
      </View>
      <View style={styles.keypadView}>
        <KeypadComponent onDelete={onKeypadDelete} onKeyPress={onKeypadPress} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple3,
    position: 'absolute',
    zIndex: 3,
    paddingHorizontal: 40,
  },
  messageView: { flex: 1.5, justifyContent: 'flex-end', marginBottom: 20 },
  dotsView: { flex: 1 },
  keypadView: { flex: 4 },
})

export default PinScreen
