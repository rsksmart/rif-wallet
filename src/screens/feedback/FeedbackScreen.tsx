import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { RegularText } from '../../components'
import { PrimaryButton2 } from '../../components/button/PrimaryButton2'
import { TextInputWithLabel } from '../../components/input/TextInputWithLabel'
import { colors } from '../../styles'
import { sendFeedbackToGithub } from './operations'
import { ThankYouComponent } from './ThankYouComponent'

export const FeedbackScreen: React.FC = () => {
  const [isSent, setIsSent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')

  const submitFeedback = () => {
    setIsLoading(true)
    if (feedback !== '') {
      sendFeedbackToGithub(name, email, feedback)
        .then(() => setIsSent(true))
        .catch((error: any) => {
          console.log({ error })
          setIsLoading(false)
        })
    }
  }

  if (isSent) {
    return <ThankYouComponent />
  }

  return (
    <View style={styles.container}>
      <RegularText style={styles.heading}>Feedback form</RegularText>

      <TextInputWithLabel
        label="name"
        placeholder="your name"
        value={name}
        setValue={setName}
        style={styles.input}
      />

      <TextInputWithLabel
        label="email"
        placeholder="your email"
        value={email}
        setValue={setEmail}
        style={styles.input}
      />

      <TextInputWithLabel
        label="comments"
        placeholder="your feedback"
        value={feedback}
        setValue={setFeedback}
        multiline={true}
        inputStyle={styles.feedback}
        style={styles.input}
        textAlignVertical="top"
      />

      <PrimaryButton2
        title="Submit"
        onPress={submitFeedback}
        disabled={isLoading}
      />
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
  input: {
    marginBottom: 10,
  },
  feedback: {
    paddingTop: 20,
    height: 150,
  },
})
