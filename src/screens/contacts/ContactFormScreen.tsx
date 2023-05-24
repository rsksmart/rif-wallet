import { useCallback, useEffect, useMemo } from 'react'
import { CompositeScreenProps } from '@react-navigation/native'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { StyleSheet } from 'react-native'

import { getChainIdByType } from 'lib/utils'

import {
  contactsStackRouteNames,
  ContactsStackScreenProps,
} from 'navigation/contactsNavigator'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { AppButton } from 'components/button'
import { AddressInput } from 'components/address'
import { Input } from 'components/index'
import { Contact, ContactWithAddressRequired } from 'shared/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { addContact, editContact } from 'store/slices/contactsSlice'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { sharedColors, sharedStyles, testIDs } from 'shared/constants'
import { castStyle } from 'shared/utils'

export type ContactFormScreenProps = CompositeScreenProps<
  ContactsStackScreenProps<contactsStackRouteNames.ContactForm>,
  RootTabsScreenProps<rootTabsRouteNames.Contacts>
>

interface FormValues {
  name: string
  address: {
    address: string
    displayAddress: string
  }
  displayAddress: string
  addressIsValid: boolean
}

export const ContactFormScreen = ({
  navigation,
  route,
}: ContactFormScreenProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const schema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .required()
          .min(3, t('contact_form_name_too_short'))
          .max(50, t('contact_form_name_too_long'))
          .trim(),
        address: yup.object({
          address: yup.string().required(),
          displayAddress: yup.string().required(),
        }),
        addressIsValid: yup.boolean().isTrue(),
      }),
    [t],
  )

  const initialValue: Partial<Contact> = useMemo(
    () =>
      route.params?.initialValue ?? {
        name: '',
        address: '',
        displayAddress: '',
      },
    [route.params],
  )
  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      name: initialValue.name,
      address: {
        address: initialValue.address,
        displayAddress: initialValue.displayAddress,
      },
      addressIsValid: false,
    },
    resolver: yupResolver(schema),
  })
  const {
    resetField,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid: formIsValid, errors },
  } = methods

  const addressObj = watch('address')
  const { chainType = ChainTypeEnum.TESTNET } =
    useAppSelector(selectActiveWallet)

  const handleAddressChange = useCallback(
    (address: string, displayAddress: string, isValid: boolean) => {
      setValue('address', { address, displayAddress })
      setValue('addressIsValid', isValid)
    },
    [setValue],
  )

  const saveContact = useCallback(
    ({ name, address: { address, displayAddress } }: FormValues) => {
      if (initialValue.address) {
        const contact: Contact = {
          name,
          address,
          displayAddress: displayAddress,
        }
        dispatch(editContact(contact))
      } else {
        dispatch(
          addContact({
            name,
            address,
            displayAddress,
          }),
        )
      }
      navigation.navigate(contactsStackRouteNames.ContactsList)
    },
    [dispatch, initialValue, navigation],
  )

  useEffect(() => {
    navigation.setOptions({
      headerTitle: initialValue.address
        ? t('contact_form_title_edit')
        : t('contact_form_title_create'),
      headerTintColor: sharedColors.white,
      headerRightContainerStyle: {
        paddingTop: 0,
      },
      headerLeftContainerStyle: {
        paddingTop: 0,
      },
    })
  }, [navigation, initialValue, t])

  return (
    <KeyboardAvoidingView
      style={sharedStyles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView>
        <FormProvider {...methods}>
          <AddressInput
            label={t('address_rns_placeholder')}
            placeholder={t('address_rns_placeholder')}
            inputName={'address'}
            testID={'addressInput'}
            value={addressObj}
            resetValue={() => resetField('address')}
            onChangeAddress={handleAddressChange}
            chainId={getChainIdByType(chainType)}
          />
          <Input
            label={t('contact_form_name')}
            inputName={'name'}
            testID={'nameInput'}
            subtitle={errors.name?.message}
            subtitleStyle={styles.fieldError}
            accessibilityLabel={'nameInput'}
            placeholder={t('contact_form_name')}
            resetValue={() => resetField('name')}
          />
        </FormProvider>
      </ScrollView>
      <AppButton
        testID={testIDs.saveButton}
        accessibilityLabel={testIDs.saveButton}
        title={t('contact_form_button_save')}
        onPress={handleSubmit(saveContact)}
        style={sharedStyles.appButtonBottom}
        textColor={sharedColors.inputInactive}
        disabled={!formIsValid}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  fieldError: castStyle.text({
    color: sharedColors.dangerLight,
    bottom: '10%',
  }),
})
