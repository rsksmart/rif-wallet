import React from 'react'
import { StyleSheet, View } from 'react-native'
import { RegularText } from '../../typography'
import { MessageComponentDefaultType } from './PinScreen'

const MessageComponent: React.FC<MessageComponentDefaultType> = ({
  message = 'Enter PIN',
}) => {
  return (
    <View style={messageStyles.container}>
      <RegularText style={messageStyles.text}>{message}</RegularText>
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
