import { useCallback, useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { AppButton, Input } from 'components/index'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'

import { sendFeedbackToGithub } from './operations'
import { ThankYouComponent } from './ThankYouComponent'

const schema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email().required('Email is required'),
  message: yup.string().required('Message is required'),
})

export const FeedbackScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.FeedbackScreen>) => {
  const [isSent, setIsSent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const {
    resetField,
    handleSubmit,
    formState: { errors },
  } = methods
  const hasErrors = Object.keys(errors).length > 0

  const onSubmit = useCallback(
    (data: FieldValues) => {
      if (!hasErrors) {
        const { name, email, message } = data
        sendFeedbackToGithub(name, email, message)
          .then(() => setIsSent(true))
          .catch(error => {
            console.log({ error })
            setIsLoading(false)
          })
      }
    },
    [hasErrors],
  )

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])

  if (isSent) {
    return <ThankYouComponent />
  }

  return (
    <View style={styles.container}>
      <View style={sharedStyles.flex}>
        <FormProvider {...methods}>
          <Input
            accessibilityLabel="feedbackName"
            inputName="name"
            label={'Your name (voluntary)'}
            placeholder={'Your name (voluntary)'}
            resetValue={() => resetField('name')}
            containerStyle={styles.input}
          />

          <Input
            accessibilityLabel="feedbackEmail"
            inputName="email"
            label={'Your email'}
            placeholder={'Your email'}
            resetValue={() => resetField('email')}
            subtitle={errors.email?.message as string}
            subtitleStyle={{ color: sharedColors.dangerLight }}
            containerStyle={styles.input}
          />

          <Input
            accessibilityLabel="feedbackMessage"
            inputName="message"
            label={'Message'}
            placeholder={'Message'}
            resetValue={() => resetField('message')}
            subtitle={errors.message?.message as string}
            subtitleStyle={{ color: sharedColors.dangerLight }}
            multiline={true}
            containerStyle={styles.feedback}
            textAlignVertical="top"
          />
        </FormProvider>
      </View>
      <AppButton
        accessibilityLabel="sendFeedbackButton"
        style={styles.submitButton}
        title="Send feedback"
        color={sharedColors.white}
        textColor={sharedColors.black}
        disabled={hasErrors || isLoading}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: sharedColors.secondary,
    paddingHorizontal: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  input: {
    height: 90,
  },
  feedback: {
    height: 150,
  },
  submitButton: {
    marginTop: 20,
  },
})
