import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'

import { AppButton, Input, Typography } from 'components/index'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'

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
  const [axiosMessage, setAxiosMessage] = useState<string>('')
  const { t } = useTranslation()

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
        setIsLoading(true)
        setAxiosMessage('')
        sendFeedbackToGithub(name, email, message)
          .then(() => setIsSent(true))
          .catch(error => {
            setIsLoading(false)
            if (error instanceof Error) {
              setAxiosMessage(error.toString())
            }
          })
          .finally(() => setIsLoading(false))
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={sharedStyles.flex}>
        <FormProvider {...methods}>
          <Input
            accessibilityLabel="feedbackName"
            inputName="name"
            label={t('feedback_form_name')}
            placeholder={t('feedback_form_name')}
            resetValue={() => resetField('name')}
            containerStyle={styles.input}
          />

          <Input
            accessibilityLabel="feedbackEmail"
            inputName="email"
            label={t('feedback_form_email')}
            placeholder={t('feedback_form_email')}
            resetValue={() => resetField('email')}
            subtitle={errors.email?.message?.toString()}
            subtitleStyle={styles.fieldError}
            containerStyle={styles.input}
            forceShowSubtitle
          />

          <Input
            accessibilityLabel="feedbackMessage"
            inputName="message"
            label={t('feedback_form_message')}
            placeholder={t('feedback_form_message')}
            resetValue={() => resetField('message')}
            subtitle={errors.message?.message?.toString()}
            subtitleStyle={styles.fieldError}
            inputStyle={styles.feedbackInput}
            multiline={true}
            containerStyle={styles.feedbackLabel}
            textAlignVertical="top"
            forceShowSubtitle
            maxLength={120}
          />
        </FormProvider>
      </View>
      {isLoading && <ActivityIndicator size="large" />}
      {axiosMessage !== '' && (
        <Typography type="h4" color="white">
          {axiosMessage}
        </Typography>
      )}
      <AppButton
        accessibilityLabel="sendFeedbackButton"
        style={styles.submitButton}
        title={t('feedback_form_button_send')}
        color={sharedColors.white}
        textColor={sharedColors.black}
        disabled={isLoading || isSent}
        onPress={handleSubmit(onSubmit)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    backgroundColor: sharedColors.secondary,
    paddingTop: 30,
    paddingHorizontal: 20,
    height: '100%',
    justifyContent: 'space-between',
  }),
  content: castStyle.view({
    flex: 1,
  }),
  input: castStyle.view({
    height: 90,
  }),
  feedbackLabel: castStyle.view({
    height: 150,
  }),
  feedbackInput: castStyle.text({
    paddingTop: 10,
  }),
  submitButton: castStyle.view({
    marginTop: 20,
    height: 50,
  }),
  fieldError: castStyle.text({
    color: sharedColors.dangerLight,
    bottom: '10%',
  }),
})
