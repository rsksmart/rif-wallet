import { StyleSheet, View } from 'react-native'
import { RegularText } from '../../typography'
import { MessageComponentDefaultType } from './PinScreen'

const MessageComponent = ({
  message = 'Enter PIN',
  ViewProps = {},
  TextProps = {},
}: MessageComponentDefaultType) => {
  return (
    <View style={messageStyles.container} {...ViewProps}>
      <RegularText style={messageStyles.text} {...TextProps}>
        {message}
      </RegularText>
    </View>
  )
}

const messageStyles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
})

export default MessageComponent
