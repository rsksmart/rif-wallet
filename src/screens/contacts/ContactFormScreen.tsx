import { useCallback, useMemo } from 'react'
import { CompositeScreenProps } from '@react-navigation/native'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Icon from 'react-native-vector-icons/Ionicons'

import { getChainIdByType } from 'lib/utils'

import {
  contactsStackRouteNames,
  ContactsStackScreenProps,
} from 'navigation/contactsNavigator'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { AppButton, AppButtonWidthVarietyEnum } from 'components/button'
import { AddressInput } from 'components/address'
import { Input, Typography } from 'components/index'
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import { Contact } from 'shared/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { addContact, editContact } from 'store/slices/contactsSlice'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { setOpacity } from '../home/tokenColor'
import { castStyle } from 'shared/utils'
import { sharedColors } from 'shared/constants'

export type ContactFormScreenProps = CompositeScreenProps<
  ContactsStackScreenProps<contactsStackRouteNames.ContactForm>,
  RootTabsScreenProps<rootTabsRouteNames.Contacts>
>

interface FormValues extends Contact {
  addressIsValid: boolean
}

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
    defaultValues: {
      ...initialValue,
      addressIsValid: false,
    },
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
    ({ name, address, id }: FormValues) => {
      if (initialValue.id) {
        const contact: Contact = {
          id,
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

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.parent}>
        <View style={styles.header}>
          <Icon.Button
            accessibilityLabel="backButton"
            name="arrow-back"
            onPress={() =>
              navigation.navigate(contactsStackRouteNames.ContactsList)
            }
            backgroundColor={colors.background.primary}
            color={colors.lightPurple}
            style={styles.backButton}
            size={15}
            borderRadius={20}
          />
          <Typography type={'body1'} style={styles.title}>
            {initialValue.id
              ? t('contact_form_title_edit')
              : t('contact_form_title_create')}
          </Typography>
        </View>
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
          />
        </FormProvider>
      </ScrollView>
      <AppButton
        testID={'saveButton'}
        accessibilityLabel={'saveButton'}
        title={t('contact_form_button_save')}
        onPress={handleSubmit(saveContact)}
        widthVariety={AppButtonWidthVarietyEnum.INLINE}
        style={styles.saveButton}
        textColor={sharedColors.inputInactive}
        disabled={!formIsValid}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
  },
  parent: {
    alignContent: 'space-around',
    height: '100%',
    backgroundColor: colors.background.darkBlue,
    padding: 20,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  backButton: {
    paddingRight: 0,
    alignSelf: 'center',
    color: colors.lightPurple,
  },
  title: {
    flex: 2,
    fontFamily: fonts.regular,
    color: colors.text.primary,
    textAlign: 'center',
    alignSelf: 'center',
  },
  body: {
    flex: 12,
    paddingTop: 50,
  },
  label: {
    color: colors.text.primary,
    padding: 10,
  },
  disabledLabel: {
    color: setOpacity(colors.text.primary, 0.4),
    padding: 10,
  },
  input: castStyle.text({
    color: colors.text.primary,
    fontFamily: fonts.regular,
    backgroundColor: colors.darkPurple4,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  }),
  footer: {
    marginTop: 25,
  },
  saveButton: castStyle.view({
    backgroundColor: sharedColors.white,
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
  }),
})
