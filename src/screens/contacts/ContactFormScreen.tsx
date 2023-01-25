import { CompositeScreenProps } from '@react-navigation/native'
import { AddressInput } from 'components/address'
import { PrimaryButton } from 'components/button'
import { getChainIdByType } from 'lib/utils'
import {
  contactsStackRouteNames,
  ContactsStackScreenProps,
} from 'navigation/contactsNavigator'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { useCallback, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { RegularText } from 'src/components'
import { colors, grid } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import { addContact, editContact } from 'store/slices/contactsSlice'
import { Contact } from 'store/slices/contactsSlice/types'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { setOpacity } from '../home/tokenColor'

export type ContactFormScreenProps = CompositeScreenProps<
  ContactsStackScreenProps<contactsStackRouteNames.ContactForm>,
  RootStackScreenProps<rootStackRouteNames.Contacts>
>

export const ContactFormScreen = ({
  navigation,
  route,
}: ContactFormScreenProps) => {
  const { chainType = ChainTypeEnum.TESTNET } =
    useAppSelector(selectActiveWallet)
  const initialValue: Partial<Contact> = route.params?.initialValue ?? {
    name: '',
    address: '',
  }
  const dispatch = useAppDispatch()
  const [name, setName] = useState(initialValue.name || '')
  const [address, setAddress] = useState({
    value: initialValue.address || '',
    isValid: !!initialValue.address,
  })
  const isValidContact = name && address.isValid

  const handleAddressChange = useCallback((value: string, isValid: boolean) => {
    setAddress({ value, isValid })
  }, [])

  const saveContact = () => {
    if (initialValue.id) {
      const contact: Contact = {
        ...initialValue,
        id: initialValue.id,
        name,
        address: address.value,
        displayAddress: address.value,
      }
      dispatch(editContact(contact))
    } else {
      dispatch(
        addContact({
          name,
          address: address.value,
          displayAddress: address.value,
        }),
      )
    }
    navigation.navigate(contactsStackRouteNames.ContactsList)
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView>
        <View style={styles.parent}>
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
            <RegularText style={styles.title}>
              {initialValue.id ? 'Edit Contact' : 'Create Contact'}
            </RegularText>
          </View>
          <View style={styles.body}>
            <RegularText style={styles.label}>name</RegularText>
            <TextInput
              testID="nameInput"
              accessibilityLabel="nameInput"
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder="name your contact..."
              placeholderTextColor={colors.text.secondary}
            />
            <View style={grid.row}>
              {/* <RegularText style={styles.disabledLabel}>alias</RegularText> */}
              <RegularText style={styles.label}>address</RegularText>
            </View>
            <AddressInput
              testID="addressInput"
              initialValue={initialValue.address || ''}
              onChangeText={handleAddressChange}
              chainId={getChainIdByType(chainType)}
              backgroundColor={colors.darkPurple4}
            />
          </View>
          <View style={styles.footer}>
            <PrimaryButton
              testID="saveButton"
              accessibilityLabel="saveButton"
              title="Save Contact"
              onPress={saveContact}
              style={styles.saveButton}
              disabled={!isValidContact}
            />
          </View>
        </View>
      </ScrollView>
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
    fontSize: 16,
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
  input: {
    color: colors.text.primary,
    fontFamily: fonts.regular,
    backgroundColor: colors.darkPurple4,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  footer: {
    marginTop: 25,
  },
  saveButton: {
    justifyContent: 'center',
    backgroundColor: colors.blue2,
    borderWidth: 0,
    borderRadius: 20,
    height: 50,
  },
})
