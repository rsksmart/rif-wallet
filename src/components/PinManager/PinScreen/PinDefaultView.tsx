import { KeyPad } from '../../keyPad'
import { StyleSheet, View } from 'react-native'
import DotsComponentDefault from './DotsComponent'
import { PinScreenType, DotsComponentDefaultType } from './PinScreen'
import MessageComponentDefault from './MessageComponent'
import { colors } from '../../../styles'
import { WhiteButton } from '../../button/ButtonVariations'

const PinScreen = ({
  MessageComponent = MessageComponentDefault,
  DotsComponent = DotsComponentDefault,
  KeypadComponent = KeyPad,
  onKeypadDelete,
  onKeypadPress,
  pin,
  error = null,
  resetEnabled,
  resetKeysAndPin,
}: PinScreenType & DotsComponentDefaultType) => {
  return (
    <View style={styles.container}>
      <View style={styles.messageView}>
        <MessageComponent message={error || undefined} />
      </View>
      <View>
        <DotsComponent pin={pin} />
      </View>
      <View>
        <KeypadComponent onDelete={onKeypadDelete} onKeyPress={onKeypadPress} />
      </View>

      {resetEnabled && (
        <WhiteButton
          onPress={resetKeysAndPin}
          accessibilityLabel="newWallet"
          title={'reset'}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    backgroundColor: colors.darkPurple3,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  messageView: {
    marginBottom: 20,
  },
})

export default PinScreen
