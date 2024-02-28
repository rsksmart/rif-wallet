import { useCallback, useEffect, useMemo, useState } from 'react'
import { CompositeScreenProps, useIsFocused } from '@react-navigation/native'
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { StyleSheet } from 'react-native'

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
import {
  addContact,
  editContact,
  getContactsAsArray,
} from 'store/slices/contactsSlice'
import { selectChainId, setFullscreen } from 'store/slices/settingsSlice'
import { sharedColors, sharedStyles, testIDs } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { sharedHeaderLeftOptions } from 'src/navigation'

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

export const checkIfContactExists = (
  address: string,
  name: string,
  searchArray: Contact[],
) => {
  const index = searchArray.findIndex(c => {
    return (
      c.displayAddress === address.toLowerCase() ||
      c.address === address.toLowerCase() ||
      c.name.toLowerCase() === name.toLowerCase()
    )
  })

  if (index !== -1) {
    return true
  }

  return false
}

export const ContactFormScreen = ({
  navigation,
  route,
}: ContactFormScreenProps) => {
  const contacts = useAppSelector(getContactsAsArray)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [rnsLoading, setRnsLoading] = useState(false)
  const isFocused = useIsFocused()

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
          displayAddress: yup.string().notRequired(),
        }),
        addressIsValid: yup.boolean().isTrue(),
      }),
    [t],
  )

  const proposed = route.params?.proposed

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
        address: initialValue.displayAddress || initialValue.address,
        displayAddress: initialValue.displayAddress,
      },
      addressIsValid: false,
    },
    resolver: yupResolver(schema),
  })
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods

  // form values
  const addressObj = watch('address')
  const nameValue = watch('name')

  // form errors
  const hasErrors =
    addressObj.address.length === 0 ||
    nameValue.length === 0 ||
    Boolean(errors.address?.address) ||
    Boolean(errors.addressIsValid) ||
    Boolean(errors.name)

  const chainId = useAppSelector(selectChainId)

  const handleAddressChange = useCallback(
    (address: string, displayAddress: string, isValid: boolean) => {
      setValue('address', { address, displayAddress })
      setValue('addressIsValid', isValid)
    },
    [setValue],
  )

  const saveContact = useCallback(
    ({ name, address: { address, displayAddress } }: FormValues) => {
      const lAddress = address.toLowerCase()
      const trimmedName = name.trim()

      let contactsToEvaluate: Contact[] = contacts

      // if in edit mode remove the desired contact from exist evaluation
      if (initialValue.address) {
        contactsToEvaluate = contactsToEvaluate.filter(
          c =>
            c.displayAddress !==
            (initialValue.displayAddress || initialValue.address),
        )
      }

      const contact: Contact = {
        name: trimmedName,
        address: lAddress,
        displayAddress,
      }
      const contactExists = checkIfContactExists(
        displayAddress && lAddress,
        trimmedName,
        contactsToEvaluate,
      )

      if (contactExists) {
        Alert.alert(t('contact_form_alert_title'), undefined, [
          {
            text: t('ok'),
          },
        ])
        return
      }

      if (initialValue.address) {
        dispatch(editContact(contact))
      } else {
        dispatch(addContact(contact))
      }

      navigation.replace(contactsStackRouteNames.ContactsList)
      // if saving was proposed from SendScreen
      proposed && navigation.navigate(rootTabsRouteNames.Home)
    },
    [dispatch, initialValue, navigation, proposed, contacts, t],
  )

  useEffect(() => {
    const editMode = !!initialValue.address && !proposed
    navigation.setOptions({
      headerTitle: editMode
        ? t('contact_form_title_edit')
        : t('contact_form_title_create'),
      headerTintColor: sharedColors.text.primary,
      headerStyle: {
        backgroundColor: sharedColors.background.primary,
      },
      headerRightContainerStyle: {
        paddingTop: 0,
      },
      headerLeftContainerStyle: {
        paddingTop: 0,
      },
      headerLeftLabelVisible: editMode,
      headerLeft: proposed
        ? () =>
            sharedHeaderLeftOptions(() => {
              navigation.replace(contactsStackRouteNames.ContactsList)
              navigation.navigate(rootTabsRouteNames.Home)
            })
        : undefined,
    })
  }, [navigation, initialValue, t, proposed])

  useEffect(() => {
    dispatch(setFullscreen(isFocused || !!proposed))
    return () => {
      dispatch(setFullscreen(false))
    }
  }, [dispatch, isFocused, proposed])

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
            testID={testIDs.addressInput}
            accessibilityLabel={testIDs.addressInput}
            value={addressObj}
            resetValue={() =>
              setValue('address', { address: '', displayAddress: '' })
            }
            onChangeAddress={handleAddressChange}
            chainId={chainId}
            isBitcoin={false}
            onSetLoadingRNS={setRnsLoading}
          />
          <Input
            label={t('contact_form_name')}
            inputName={'name'}
            testID={testIDs.nameInput}
            accessibilityLabel={testIDs.nameInput}
            subtitle={errors.name?.message}
            subtitleStyle={styles.fieldError}
            placeholder={t('contact_form_name')}
            resetValue={() => setValue('name', '')}
          />
        </FormProvider>
      </ScrollView>
      <AppButton
        testID={testIDs.saveButton}
        accessibilityLabel={testIDs.saveButton}
        title={t('contact_form_button_save')}
        onPress={handleSubmit(saveContact)}
        style={sharedStyles.appButtonBottom}
        color={sharedColors.button.primaryBackground}
        textColor={sharedColors.button.primaryText}
        disabled={hasErrors || rnsLoading}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  fieldError: castStyle.text({
    color: sharedColors.danger,
  }),
})
