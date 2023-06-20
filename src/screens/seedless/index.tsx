import { FormProvider, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useCallback, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { AppButton, Input, Typography } from 'components/index'
import { sharedColors, sharedStyles } from 'src/shared/constants'
import { unlockWithMagic } from 'store/slices/magicSlice'
import { useAppDispatch } from 'src/redux/storeUtils'

interface FormValues {
  email: string
}

const schema = yup.object<FormValues>({
  email: yup.string().required().email().trim(),
})

export const SeendlessOnboarding = () => {
  const dispatch = useAppDispatch()
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
    async (values: FormValues) => {
      const res = await dispatch(
        unlockWithMagic({ type: 'email', email: values.email }),
      ).unwrap()
      //   const userData = await magic.user.getInfo()

      //   dispatch(createWallet({ mnemonic: userData.publicAddress ?? '' }))

      console.log('RES', res)
    },
    [dispatch],
  )

  useEffect(() => {
    console.log('ERRORS', errors)
  }, [errors])

  return (
    <View style={sharedStyles.screen}>
      <FormProvider {...methods}>
        <Typography type={'h2'} style={{ marginTop: 68 }}>
          {'Hello&Welcome'}
        </Typography>
        <Input
          containerStyle={{ marginTop: 24 }}
          label={'Email'}
          inputName={'email'}
          autoCapitalize={'none'}
          resetValue={() => resetField('email')}
        />
        <AppButton
          title={'Sign In/Register'}
          style={{ marginTop: 20 }}
          color={sharedColors.white}
          textColor={sharedColors.black}
          onPress={handleSubmit(onSubmit)}
        />

        <View style={{ width: '100%', marginTop: 50 }}>
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: sharedColors.inputLabelColor,
            }}
          />
          <Typography
            type={'body3'}
            style={{
              color: sharedColors.inputLabelColor,
              position: 'absolute',
              left: '33%',
              bottom: -7.5,
              backgroundColor: sharedColors.black,
              width: '32%',
              textAlign: 'center',
            }}>
            {'or continue with'}
          </Typography>
        </View>
      </FormProvider>
    </View>
  )
}
