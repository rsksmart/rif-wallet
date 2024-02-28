import { FormProvider, useForm } from 'react-hook-form'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { AppButton, AppTouchable, Input, Typography } from 'components/index'
import { noop, sharedColors, sharedStyles } from 'shared/constants'
import { useAppDispatch } from 'store/storeUtils'
import { castStyle } from 'shared/utils'
import { Google, SocialSvgProps } from 'components/icons/Google'
import { Facebook } from 'components/icons/Facebook'
import { Apple } from 'components/icons/Apple'
import { useInitializeWallet } from 'src/shared/wallet'
import { ConfirmationModal } from 'src/components/modal'
import { useGlobalMagicInstance } from 'components/GlobalErrorHandler/GlobalErrorHandlerContext'
import {
  loginWithEmail,
  selectSeedlessLoading,
} from 'store/slices/seedlessSlice'

interface FormValues {
  email: string
}

interface TouchableSocialProps {
  onPress: () => void
  Component: (props: SocialSvgProps) => JSX.Element
  style?: StyleProp<ViewStyle>
}

const TouchableSocial = ({
  Component,
  onPress,
  style,
}: TouchableSocialProps) => {
  return (
    <AppTouchable width={108} onPress={onPress} style={style}>
      <Component width={108} />
    </AppTouchable>
  )
}

const schema = yup.object<FormValues>({
  email: yup.string().required().email().trim(),
})

export const LoginWithEmail = () => {
  const magic = useGlobalMagicInstance()
  const [showWarning, setShowWarning] = useState(true)
  const initializeWallet = useInitializeWallet()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const loading = useSelector(selectSeedlessLoading)

  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(schema),
  })

  const {
    handleSubmit,
    resetField,
    formState: { errors },
  } = methods

  const onSubmit = useCallback(
    async ({ email }: FormValues) => {
      try {
        dispatch(loginWithEmail({ email, initializeWallet, magic }))
      } catch (err) {
        console.log('ERROR LOGGING IN WITH MAGIC', err)
      }
    },
    [dispatch, initializeWallet, magic],
  )

  useEffect(() => {
    console.log('ERRORS', errors)
  }, [errors])

  return (
    <View style={sharedStyles.screen}>
      <ConfirmationModal
        isVisible={showWarning}
        title={'Email for Login Only!'}
        description={
          'Remember, If you lose access to your email, you will not be able to log in into your wallet. \n \n Ensure uninterrupted access by saving your recovery phrase for account recovery after your registration.'
        }
        onOk={() => setShowWarning(false)}
        okText={'OK, Continue'}
      />
      <FormProvider {...methods}>
        <Typography type={'h2'} style={styles.title}>
          {t('magic_email_title')}
        </Typography>
        <Input
          containerStyle={styles.emailInput}
          label={t('magic_email_placeholder')}
          inputName={'email'}
          autoCapitalize={'none'}
          resetValue={() => resetField('email')}
          placeholder={t('magic_email_placeholder')}
        />
        <AppButton
          style={styles.button}
          title={t('magic_button_sign_in')}
          color={sharedColors.white}
          textColor={sharedColors.black}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />

        <View style={styles.continueWithContainer}>
          <View style={styles.line} />
          <Typography type={'body3'} style={styles.continueWithText}>
            {t('magic_continue_with')}
          </Typography>
        </View>
      </FormProvider>
      <View style={styles.socialsWrapper}>
        <TouchableSocial Component={Google} onPress={noop} />
        <TouchableSocial
          Component={Facebook}
          onPress={noop}
          style={styles.socialBtn}
        />
        <TouchableSocial
          Component={Apple}
          onPress={noop}
          style={styles.socialBtn}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({ marginTop: 42 }),
  emailInput: castStyle.text({ marginTop: 24 }),
  button: castStyle.view({ marginTop: 20 }),
  continueWithContainer: castStyle.view({ width: '100%', marginTop: 50 }),
  line: castStyle.view({
    width: '100%',
    height: 1,
    backgroundColor: sharedColors.inputLabelColor,
  }),
  continueWithText: castStyle.text({
    color: sharedColors.inputLabelColor,
    position: 'absolute',
    left: '33%',
    bottom: -7.5,
    backgroundColor: sharedColors.black,
    width: '32%',
    textAlign: 'center',
  }),
  socialsWrapper: castStyle.view({
    marginTop: 57,
    flexDirection: 'row',
  }),
  socialBtn: castStyle.view({
    marginLeft: 12,
  }),
})
