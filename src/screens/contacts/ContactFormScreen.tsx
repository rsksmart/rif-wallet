import { useCallback, useEffect, useMemo } from 'react'
import { CompositeScreenProps } from '@react-navigation/native'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

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
import { Contact } from 'shared/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { addContact, editContact } from 'store/slices/contactsSlice'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { sharedColors, sharedStyles, testIDs } from 'shared/constants'

export type ContactFormScreenProps = CompositeScreenProps<
  ContactsStackScreenProps<contactsStackRouteNames.ContactForm>,
  RootTabsScreenProps<rootTabsRouteNames.Contacts>
>

interface FormValues {
  name: string
  address: string
  addressIsValid: boolean
}

const schema = yup.object({
  name: yup.string().required().trim(),
  address: yup.string().required(),
  addressIsValid: yup.boolean().isTrue(),
})

export const ContactFormScreen = ({
  navigation,
  route,
}: ContactFormScreenProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const initialValue: Partial<Contact> = useMemo(
    () =>
      route.params?.initialValue ?? {
        name: '',
        address: '',
      },
    [route.params],
  )
  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      name: initialValue.name,
      address: initialValue.address,
      addressIsValid: false,
    },
    resolver: yupResolver(schema),
  })
  const {
    resetField,
    handleSubmit,
    setValue,
    formState: { isValid: formIsValid },
  } = methods
  const { chainType = ChainTypeEnum.TESTNET } =
    useAppSelector(selectActiveWallet)

  const handleAddressChange = useCallback(
    (value: string, isValid: boolean) => {
      setValue('address', value)
      setValue('addressIsValid', isValid)
    },
    [setValue],
  )

  const saveContact = useCallback(
    ({ name, address }: FormValues) => {
      if (initialValue.address) {
        const contact: Contact = {
          name,
          address,
          displayAddress: address,
        }
        dispatch(editContact(contact))
      } else {
        dispatch(
          addContact({
            name,
            address,
            displayAddress: address,
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
            initialValue={initialValue.address || ''}
            resetValue={() => resetField('address')}
            onChangeAddress={handleAddressChange}
            chainId={getChainIdByType(chainType)}
          />
          <Input
            label={t('contact_form_name')}
            inputName={'name'}
            testID={'nameInput'}
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
