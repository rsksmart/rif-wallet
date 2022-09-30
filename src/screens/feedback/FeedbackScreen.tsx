import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { RegularText } from '../../components'
import { PurpleButton } from '../../components/button/ButtonVariations'
import { TextInputWithLabel } from '../../components/input/TextInputWithLabel'
import { colors } from '../../styles'

interface FeedbackInterface {}

export const FeedbackScreen: React.FC<FeedbackInterface> = ({}) => {
  const [isSent, setIsSent] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')

  const submitFeedback = () => {
    setIsSent(true)
  }

  if (isSent) {
    return <RegularText>Thank you!</RegularText>
  }

  return (
    <View style={styles.container}>
      <RegularText style={styles.heading}>Feedback form</RegularText>

      <TextInputWithLabel
        label="Name"
        placeholder="your name"
        value={name}
        setValue={setName}
      />

      <TextInputWithLabel
        label="Email"
        placeholder="your email"
        value={email}
        setValue={setEmail}
      />

      <TextInputWithLabel
        label="Comments"
        placeholder="your feedback"
        value={feedback}
        setValue={setFeedback}
        multiline={true}
        inputStyle={styles.feedback}
      />

      <PurpleButton title="Submit" onPress={submitFeedback} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple3,
    paddingHorizontal: 20,
    height: '100%',
  },
  heading: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  feedback: {
    paddingTop: 20,
    height: 150,
  },
})
